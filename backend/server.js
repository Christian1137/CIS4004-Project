const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/CIS4004ProjectDB')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Server Running'));

app.listen(PORT, () => console.log(`Server on port ${PORT}`));



// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Register Route
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const newUser = new User({ username, password, role });
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) { 
    console.error("Registration Error:", err);

    // dupe username
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username already exists." });
    }
    // other errors
    res.status(400).json({ message: err.message });
  }
});

// Login Route 
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: "User not found" }); // CHANGE to .json
  }

  if (user.password === password) { 
    res.json({ 
      message: "Login successful!", 
      role: user.role,
      username: user.username 
    });
  } else {
    // CHANGE: Use a consistent JSON format for the error
    res.status(401).json({ message: "Incorrect password" }); 
  }
});

// Create User's Team 
app.post('/team', async (req, res) => {
  try {
    const { userId, teamName, pokemonIds } = req.body;
    
    const newTeam = new Team({
      userId,
      teamName,
      pokemon: pokemonIds
    });

    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).send("Error creating team: " + err.message);
  }
});

// Get User's Team
app.get('/team/get/:userId', async (req, res) => {
  try {

    const teams = await Team.find({ userId: req.params.userId }).populate('pokemon');
    res.json(teams);

  } catch (err) {
    res.status(500).send("Error fetching teams");
  }
});

// Update User's Team
app.put('/team/update/:id', async (req, res) => {
  try {
    const { teamName, pokemonIds } = req.body;
    
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id, 
      { teamName, pokemon: pokemonIds },
      { new: true }
    );
    res.json(updatedTeam);
  } catch (err) {
    res.status(400).send("Update failed");
  }
});
