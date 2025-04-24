// backend/Userdata.js
const express = require('express');
const router = express.Router();
const User = require('./models/User');

// Save user data
router.post('/save', async (req, res) => {
  try {
    const { userId, name, language, theme } = req.body;

    let user = await User.findOne({ userId });
    if (user) {
      user.name = name;
      user.language = language;
      user.theme = theme;
      await user.save();
    } else {
      user = new User({ userId, name, language, theme });
      await user.save();
    }

    res.status(200).json({ message: 'User data saved successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save user data.' });
  }
});

// Get user data
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user data.' });
  }
});

module.exports = router;
