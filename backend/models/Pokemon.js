const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hp: { type: Number, required: true },
  attack: { type: Number, required: true },
  defense: { type: Number, required: true },
  type1: { type: String, required: true },
  type2: { type: String }, 
  allowedMoves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Move' }],
  allowedAbilities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ability' }]
});

module.exports = mongoose.model('Pokemon', pokemonSchema);