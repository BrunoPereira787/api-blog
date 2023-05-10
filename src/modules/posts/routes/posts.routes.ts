import { Router } from 'express'
import isAuthenticated from '@shared/http/middlewares/isAuthenticated'
import uploadConfig from '@config/upload'
import multer from 'multer'
import PostsController from '../controllers/PostsController'
import { Joi, Segments, celebrate } from 'celebrate'

const postsRouter = Router()
const postsController = new PostsController()
const upload = multer(uploadConfig.multer)

postsRouter.post(
  '/',
  isAuthenticated,
  upload.single('image'),
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      summary: Joi.string().required(),
      content: Joi.string().required(),
    },
  }),
  postsController.create
)

postsRouter.get('/', postsController.index)

postsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  postsController.show
)

postsRouter.delete(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  postsController.delete
)

postsRouter.put(
  '/:id',
  isAuthenticated,
  upload.single('image'),
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      title: Joi.string().required(),
      summary: Joi.string().required(),
      content: Joi.string().required(),
    },
  }),
  postsController.update
)

export default postsRouter
