/* eslint-disable max-len */
/* eslint-disable consistent-return */

const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки. ' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию. ' });
      }
    });
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию. ' }));
};

module.exports.deleteCardId = async (req, res) => {
  try {
    const cardDelete = await Card.findById(req.params.cardId);
    if (cardDelete) {
      await Card.deleteOne({ _id: req.params.cardId });
      res.status(200).send({ _id: req.params.cardId });
    } else {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Некорректные данные карточки' });
    }
    res.status(500).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports.likeCard = async (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.send({ data: card })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          res.status(404).send({ message: 'Карточка не найдена' });
        } else if (err.name === 'CastError') {
          res.status(400).send({ message: 'Некорректный id карточки' });
        } else {
          res.status(500).send({ message: 'Произошла ошибка сервера' });
        }
      }));
};

module.exports.dislikeCard = async (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.send({ data: card })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          res.status(404).send({ message: 'Карточка не найдена' });
        } else if (err.name === 'CastError') {
          res.status(400).send({ message: 'Некорректный id карточки' });
        } else {
          res.status(500).send({ message: 'Произошла ошибка сервера' });
        }
      }));
};
