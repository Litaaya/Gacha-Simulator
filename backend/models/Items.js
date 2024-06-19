const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: String,
  image: String,
  count: Number,
});

module.exports = mongoose.model('Item', ItemSchema);
