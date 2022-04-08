const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.use((req, res, next) => {
  req.user = {
    _id: '6250876c4a92cdc319444c79',
  };

  next();
});

app.use(userRouter);

app.use(cardRouter);

app.listen(PORT);
