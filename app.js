const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.use(auth);

app.use(userRouter);

app.use(cardRouter);

app.post('/signin', login);

app.post('/signup', createUser);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Ошибка 404. Страница не найдена' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
