/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(200).send({ message: `Пользователь ${email} успешно создан` }))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
module.exports.getUserMe = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user._id) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректные данные пользователя' });
      }
      return res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getUserId = async (req, res) => {
  try {
    const getUserId = await User.findById(req.params.userId);
    if (getUserId) {
      res.status(200).send(getUserId);
    } else {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Некорректные данные пользователя' });
    }
    res.status(500).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports.updateAvatarUser = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateProfileUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).send({ message: 'Авторизация успешна', token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
