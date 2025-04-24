// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');

// Login verification route
router.post('/verify', async (req, res) => {
  try {
    const { userId, password } = req.body;
    
    // Fetch authentication data from GitHub JSON
    const response = await axios.get('https://raw.githubusercontent.com/Nadishan-Dev/Andaradeniya/main/Log.JSON');
    const users = response.data;
    
    // Check if user exists and password matches
    const userExists = users.some(
      (user) => user.userId === userId && user.password === password
    );
    
    if (userExists) {
      // Check if user already exists in our database
      let user = await User.findOne({ userId });
      
      // If not, create a new user
      if (!user) {
        user = new User({ 
          userId,
          name: userId, // You might want to get actual name from GitHub data
          language: 'English', // Default language
          theme: 'default' // Default theme
        });
        await user.save();
      }
      
      res.status(200).json({ 
        success: true,
        userId: user.userId,
        language: user.language,
        theme: user.theme
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login verification error:', err);
    res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
});

module.exports = router;
