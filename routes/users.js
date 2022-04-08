/* eslint-disable object-curly-newline */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

const userRouter = require('express').Router();

const { getAllUsers, getUserId, createUser, updateProfileUser, updateAvatarUser } = require('../controllers/users');

userRouter.post('/users', createUser);

userRouter.get('/users/:userId', getUserId);

userRouter.get('/users', getAllUsers);

userRouter.patch('/users/me', updateProfileUser);

userRouter.patch('/users/me/avatar', updateAvatarUser);

module.exports = userRouter;
