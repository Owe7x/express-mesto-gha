const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные при создании карточки. ' }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию. ' }));
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные при создании карточки. ' }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию. ' }));
};

module.exports.deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch(() => res.status(404).send({ message: 'Карточка с указанным _id не найдена.' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка. ' }))
    .catch(() => res.status(404).send({ message: 'Передан несуществующий _id карточки. ' }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка. ' }))
    .catch(() => res.status(404).send({ message: 'Передан несуществующий _id карточки. ' }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};
