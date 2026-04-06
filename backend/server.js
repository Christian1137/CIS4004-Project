const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Team = require('./models/Team');
const Pokemon = require('./models/Pokemon');
const Move = require('./models/Move');
const Ability = require('./models/Ability');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/CIS4004ProjectDB')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Server Running'));

app.listen(PORT, () => console.log(`Server on port ${PORT}`));


app.post('/api/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const newUser = new User({ username, password, role });
    await newUser.save();
    
    res.status(201).json({ 
      message: "User created successfully!",
      userId: newUser._id,
      username: newUser.username,
      role: newUser.role
    });
  } catch (err) { 
    console.error("Registration Error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username already exists." });
    }
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: "User not found" }); 
  }

  if (user.password === password) { 
    res.json({ 
      message: "Login successful!", 
      role: user.role,
      username: user.username,
      userId: user._id 
    });
  } else {
    res.status(401).json({ message: "Incorrect username or password" }); 
  }
});



app.get('/api/pokemon', async (req, res) => {
  try {
    const pokemonList = await Pokemon.find({}, 'name').sort({ _id: 1 });
    res.json(pokemonList);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching Pokemon list" });
  }
});

app.get('/api/pokemon/:name', async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ name: req.params.name })
      .populate('allowedMoves')
      .populate('allowedAbilities');
      
    if (!pokemon) return res.status(404).json({ error: "Pokemon not found" });
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching Pokemon details" });
  }
});



app.post('/api/team', async (req, res) => {
  try {
    const { userId, teamName, roster } = req.body;
    
    const newTeam = new Team({
      userId,
      teamName,
      roster 
    });

    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: "Error creating team: " + err.message });
  }
});


// Get User's Team
app.get('/api/team/get/:userId', async (req, res) => {
  try {
    const teams = await Team.find({ userId: req.params.userId })
      .populate({ path: 'roster.pokemonId', model: 'Pokemon' })
      .populate({ path: 'roster.equippedMoves', model: 'Move' })
      .populate({ path: 'roster.chosenAbility', model: 'Ability' });
      
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Error fetching teams" });
  }
});

app.put('/api/team/update/:id', async (req, res) => {
  try {
    const { teamName, roster } = req.body;
    
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id, 
      { teamName, roster },
      { new: true }
    );
    res.json(updatedTeam);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

// Admin Route to Add New Move
app.post('/api/admin/moves', async (req, res) => {
  try {
    const newMove = new Move(req.body);
    await newMove.save();
    res.status(201).json(newMove);
  } catch (err) {
    res.status(400).json({ message: "Failed to add move" });
  }
});

// Update an existing Move's power or element
app.put('/api/admin/moves/:id', async (req, res) => {
  try {
    const updatedMove = await Move.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMove);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

// View all registered users
app.get('/api/admin/users', async (req, res) => {
  const users = await User.find({}, '-password'); // Hide passwords for security
  res.json(users);
});

// Update a User's role 
app.put('/api/admin/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { role }, 
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: "Failed to update role" });
  }
});

// Delete a specific User and their associated Teams
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Team.deleteMany({ userId: req.params.id }); 
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Deletion failed" });
  }
});
