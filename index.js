require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const app = express();
const { connect } = require('mongoose');

const schema = require('./schema');

const port = process.env.PORT || 9000;
const uriString = process.env.MONGODB_URI;
connect(uriString)
  .then(() => {
    console.log('connected to database..');
    app.listen(port, () => console.log(`listening on port ${port}...`));
  })
  .catch((error) =>
    console.log(`${error.message}. could not connect to database!`)
  );

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'dev',
  })
);
