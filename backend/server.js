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
app.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const newUser = new User({
      username,
      password,
      role: role || 'Standard'
    });

    await newUser.save();
    res.status(201).send("User created successfully!");
  } catch (err) { 
    res.status(400).send("Error: Username already exists.");
  }
})

// Login Route 
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).send("User not found");
  }

  if (user.password === password) { 
    res.json({ 
      message: "Login successful!", 
      role: user.role,
      username: user.username 
    });
  } else {
    res.status(401).send("Incorrect password");
  }
})
