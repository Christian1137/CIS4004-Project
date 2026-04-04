const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    
  // Links the team to a specific user
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  teamName: { type: String, default: "My Starter Team" },

  // Array of Pokemon IDs 
  pokemon: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pokemon' 
  }] 
});

module.exports = mongoose.model('Team', teamSchema);