// backend/routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user data
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      userId: user.userId,
      name: user.name,
      language: user.language,
      theme: user.theme
    });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ success: false, message: 'Server error fetching user data' });
  }
});

// Save user data
router.post('/save', async (req, res) => {
  try {
    const { userId, name, language, theme } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    // Update or create user
    let user = await User.findOne({ userId });
    
    if (user) {
      // Update existing user
      if (name) user.name = name;
      if (language) user.language = language;
      if (theme) user.theme = theme;
      
      await user.save();
    } else {
      // Create new user
      user = new User({ 
        userId,
        name: name || userId,
        language: language || 'English',
        theme: theme || 'default'
      });
      
      await user.save();
    }
    
    res.status(200).json({ 
      success: true,
      message: 'User data saved successfully',
      user: {
        userId: user.userId,
        name: user.name,
        language: user.language,
        theme: user.theme
      }
    });
  } catch (err) {
    console.error('Error saving user data:', err);
    res.status(500).json({ success: false, message: 'Server error saving user data' });
  }
});

module.exports = router;
