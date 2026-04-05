const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  effectType: { type: String } 
});

module.exports = mongoose.model('Item', itemSchema);