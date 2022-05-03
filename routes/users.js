/* eslint-disable object-curly-newline */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateUrl } = require('../utils/validationUrl');
const { getAllUsers, getUserId, updateProfileUser, updateAvatarUser, getUserMe } = require('../controllers/users');
const auth = require('../middlewares/auth');

userRouter.get('/users/me', getUserMe);

userRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserId);

userRouter.get('/users', auth, getAllUsers);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfileUser);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateUrl),
  }),
}), updateAvatarUser);

module.exports = userRouter;
