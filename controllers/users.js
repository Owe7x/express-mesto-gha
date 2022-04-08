/* eslint-disable consistent-return */
const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' }))
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
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара. ' }))
    .catch(() => res.status(404).send({ message: 'Пользователь с указанным _id не найден.' }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.updateProfileUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля. ' }))
    .catch(() => res.status(404).send({ message: 'Пользователь с указанным _id не найден. ' }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};
