/* eslint-disable object-curly-newline */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

const router = require('express').Router();

const { getAllCards, deleteCardId, createCard, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/cards', getAllCards);

router.post('/cards', createCard);

router.delete('/cards/:cardId', deleteCardId);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
