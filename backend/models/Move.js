const mongoose = require('mongoose');

const moveSchema = new mongoose.Schema({
  name: { type: String, required: true },
  power: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  element: { type: String, required: true }
});

module.exports = mongoose.model('Move', moveSchema);