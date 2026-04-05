// This script will automatically create the mock data for your local database
// so you guys can have something to test the frontend against.


const mongoose = require('mongoose');
const User = require('./models/User');
const Move = require('./models/Move');
const Pokemon = require('./models/Pokemon');
const Item = require('./models/Item');
const Team = require('./models/Team');

mongoose.connect('mongodb://localhost:27017/CIS4004ProjectDB')
    .then(() => console.log("Connected to MongoDB for Seeding..."))
    .catch(err => console.log(err));

const seedDatabase = async () => {
    try {
        // 1. Wipe old data
        await User.deleteMany({});
        await Move.deleteMany({});
        await Pokemon.deleteMany({});
        await Item.deleteMany({});
        await Team.deleteMany({});
        console.log("Cleared existing data.");

        // 2. Create standard and admin users
        const adminUser = new User({ username: 'admin', password: 'password123', role: 'Administrator' });
        const standardUser = new User({ username: 'ash_ketchum', password: 'password123', role: 'Standard' });
        await User.insertMany([adminUser, standardUser]);

        // 3. Create Items
        const leftovers = new Item({ name: 'Leftovers', description: 'Restores HP every turn.', effectType: 'Healing' });
        await leftovers.save();

        // 4. Create Moves
        const surf = new Move({ name: 'Surf', power: 90, accuracy: 100, element: 'Water' });
        const bite = new Move({ name: 'Bite', power: 60, accuracy: 100, element: 'Dark' });
        await Move.insertMany([surf, bite]);

        // 5. Create Pokemon (Linking the allowed moves)
        const blastoise = new Pokemon({
            name: 'Blastoise', hp: 79, attack: 83, defense: 100, type1: 'Water',
            allowedMoves: [surf._id, bite._id]
        });
        await blastoise.save();

        // 6. Create a Team for the standard user
        const ashTeam = new Team({
            userId: standardUser._id,
            teamName: "Kanto Champions",
            roster: [{
                pokemonId: blastoise._id,
                equippedMoves: [surf._id, bite._id],
                heldItem: leftovers._id
            }]
        });
        await ashTeam.save();

        console.log("Database seeded successfully with Team Builder data!");
        process.exit();
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedDatabase();