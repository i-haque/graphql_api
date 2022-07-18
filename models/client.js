const { Schema, model } = require('mongoose');

const clientSchema = new Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
});

const Client = model('client', clientSchema);

module.exports = Client;
