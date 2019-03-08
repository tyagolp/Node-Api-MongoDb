const express = require('express')
const validate = require('express-validation')
const handler = require('express-async-handler')

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

const controllers = require('./app/controllers')
const validators = require('./app/validators')

routes.post(
  '/users',
  validate(validators.User),
  handler(controllers.UserController.store)
)
routes.post(
  '/sessions',
  validate(validators.Session),
  handler(controllers.SessionController.store)
)

routes.use(authMiddleware)

/* Ads */
routes.get('/ads', handler(controllers.AdController.index))
routes.get('/ads/:id', handler(controllers.AdController.show))
routes.post(
  '/ads',
  validate(validators.Ad),
  handler(controllers.AdController.store)
)
routes.put(
  '/ads/:id',
  validate(validators.Ad),
  handler(controllers.AdController.update)
)
routes.delete('/ads/:id', handler(controllers.AdController.destroy))

/* Purchase */
routes.get('/purchase', handler(controllers.PurchaseController.index))
routes.put('/purchase/:id', handler(controllers.PurchaseController.update))
routes.post(
  '/purchases',
  validate(validators.Purchase),
  handler(controllers.PurchaseController.store)
)

module.exports = routes
