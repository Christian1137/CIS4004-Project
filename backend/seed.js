// This script will automatically create the mock data for your local database
// so you guys can have something to test the frontend against.

const mongoose = require('mongoose');
const axios = require('axios');

const Pokemon = require('./models/Pokemon');
const Move = require('./models/Move');
const Ability = require('./models/Ability');
const User = require('./models/User');
const Team = require('./models/Team');

const POKE_API_BASE = "https://pokeapi.co/api/v2";

const seedDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/CIS4004ProjectDB');
    console.log('Connected to MongoDB. Starting seed process...');

    // clear existing data
    await Pokemon.deleteMany({});
    await Move.deleteMany({});
    await Ability.deleteMany({});
    await User.deleteMany({});
    await Team.deleteMany({});
    console.log('Cleared existing collections.');

    // just gen 1
    for (let i = 1; i <= 151; i++) {
      const detailRes = await axios.get(`${POKE_API_BASE}/pokemon/${i}`);
      const pData = detailRes.data;

      console.log(`Processing #${i}: ${pData.name}...`);

      // get abilities
      const abilityIds = [];
      for (let a of pData.abilities) {
        const abilityName = a.ability.name.replace('-', ' ');
        
        let abilityDoc = await Ability.findOne({ name: abilityName });
        if (!abilityDoc) {
          const abilityRes = await axios.get(a.ability.url);
          const englishEntry = abilityRes.data.flavor_text_entries.find(entry => entry.language.name === 'en');
          const cleanDescription = englishEntry ? englishEntry.flavor_text.replace(/\n|\f/g, ' ') : "No description available.";

          abilityDoc = await Ability.create({
            name: abilityName,
            description: cleanDescription 
          });
        }
        abilityIds.push(abilityDoc._id);
      }

      // moves
      const moveIds = [];
      for (let m of pData.moves) {
        const moveName = m.move.name.replace('-', ' ');
        
        let moveDoc = await Move.findOne({ name: moveName });
        if (!moveDoc) {
          const moveRes = await axios.get(m.move.url);
          const mData = moveRes.data;

          moveDoc = await Move.create({
            name: moveName,
            // note some moves dont have power or accuracy
            power: mData.power || 0, 
            accuracy: mData.accuracy || 100,
            element: mData.type.name 
          });
        }
        moveIds.push(moveDoc._id);
      }
      // pokemon
      await Pokemon.create({
        name: pData.name,
        hp: pData.stats.find(s => s.stat.name === 'hp').base_stat,
        attack: pData.stats.find(s => s.stat.name === 'attack').base_stat,
        defense: pData.stats.find(s => s.stat.name === 'defense').base_stat,
        type1: pData.types[0].type.name,
        type2: pData.types[1] ? pData.types[1].type.name : null,
        allowedMoves: moveIds,
        allowedAbilities: abilityIds
      });
    }
    console.log('Success! Database seeded with Generation 1 Pokémon (with real moves and abilities).');

    // simple mock users
    const mockUser1 = await User.create({
      username: "Ash", password: "pikachu", role: "Trainer"
    });

    const mockUser2 = await User.create({
      username: "Andy", password: "1234", role: "Administrator"
    });

    const mockUser3 = await User.create({
      username: 'admin', password: 'password123', role: 'Administrator'
    });
    
    console.log("Mock Users created.");

    // simple mock team
    const pikachu = await Pokemon.findOne({ name: 'pikachu' });
    const charizard = await Pokemon.findOne({ name: 'charizard' });

    if (pikachu && charizard) {
      await Team.create({
        userId: mockUser1._id, 
        teamName: "Ash's Dream Team",
        roster: [
          {
            pokemonId: pikachu._id,
            chosenAbility: pikachu.allowedAbilities[0], 
            equippedMoves: [
              pikachu.allowedMoves[0], 
              pikachu.allowedMoves[1],
              pikachu.allowedMoves[2],
              pikachu.allowedMoves[3]
            ]
          },
          {
            pokemonId: charizard._id,
            chosenAbility: charizard.allowedAbilities[0], 
            equippedMoves: [
              charizard.allowedMoves[0], 
              charizard.allowedMoves[1],
              charizard.allowedMoves[2],
              charizard.allowedMoves[3]
            ]
          }
        ]
      });
      console.log("Mock Teams created.");
    }

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();