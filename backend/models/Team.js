const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamName: { type: String, default: "My Starter Team" },
  roster: [{
    pokemonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pokemon', required: true },
    equippedMoves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Move' }], 
    chosenAbility: { type: mongoose.Schema.Types.ObjectId, ref: 'Ability', required: true }
  }]
});

module.exports = mongoose.model('Team', teamSchema);