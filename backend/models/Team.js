const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamName: { type: String, default: "My Starter Team" },
  roster: [{
    pokemonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pokemon', required: true },
    equippedMoves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Move' }], // The user's chosen moves
    heldItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' } // The 5th entity requirement
  }]
});

module.exports = mongoose.model('Team', teamSchema);