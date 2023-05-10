import { Router } from 'express'
import UsersControllers from '../controllers/UsersController'
import { celebrate, Joi, Segments } from 'celebrate'
import isAuthenticated from '@shared/http/middlewares/isAuthenticated'
import isAdmin from '@shared/http/middlewares/isAdmin'

const usersRouter = Router()
const usersControllers = new UsersControllers()

usersRouter.get('/profile', isAuthenticated, usersControllers.profile)

// admin
usersRouter.get('/', isAuthenticated, isAdmin, usersControllers.index)

// admin
usersRouter.get(
  '/:id',
  isAuthenticated,
  isAdmin,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersControllers.show
)

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      confirmpassword: Joi.string().required(),
    },
  }),
  usersControllers.create
)

usersRouter.delete(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersControllers.delete
)

usersRouter.put(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().optional(),
      confirmpassword: Joi.string()
        .valid(Joi.ref('password'))
        .when('password', {
          is: Joi.exist(),
          then: Joi.required(),
        }),
    },
  }),
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersControllers.update
)

export default usersRouter
