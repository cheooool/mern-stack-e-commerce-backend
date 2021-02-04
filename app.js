const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');
const api = process.env.API_URL;

const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categoires');

// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());

// Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
