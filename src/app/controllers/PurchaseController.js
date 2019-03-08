const User = require('../models/User')
const Ad = require('../models/Ad')
const PurchaseMail = require('../jobs/PurchaseMail')
const Purchase = require('../models/Purchase')
const Queue = require('../services/Queue')

class PuchaseController {
  async index (req, res) {
    const lst = await Purchase.find({ status: false }).populate([
      'author',
      'ad'
    ])
    return res.json(lst)
  }

  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad)
      .where({
        purchasedBy: null
      })
      .populate('author')

    if (!purchaseAd) {
      return res.status(400).json({ error: 'Ad não esta mais disponivel' })
    }

    const user = await User.findById(req.userId)
    const purchaseId = await Purchase.create({
      ad,
      author: req.userId
    })
    purchaseAd.purchasedBy = purchaseId._id
    await Ad.findByIdAndUpdate(ad, purchaseAd)

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()
    return res.send()
  }

  async update (req, res) {
    const { id } = req.params
    const obj = await Purchase.findById(id).where({
      status: false
    })
    if (!obj) {
      return res.status(400).json({ error: 'compra não encontrada' })
    }

    obj.status = true
    const result = await Purchase.findByIdAndUpdate(id, obj)
    return res.json(result)
  }

  async destroy (req, res) {
    await Purchase.deleteMany()
    return res.send()
  }
}

module.exports = new PuchaseController()
