const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

// Routers
const api = process.env.API_URL;
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categoires');
const userRouter = require('./routers/users');

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, userRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    dbName: 'eshop-database',
  })
  .then(() => {
    console.log('Database Connection is ready...');
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log(api);
  console.log('server is running http://localhost:3000');
});
