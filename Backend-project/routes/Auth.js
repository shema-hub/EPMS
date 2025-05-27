const express = require('express');
const router = express.Router();
const User = require('../Models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};

// Register route
router.post('/register', async (req, res) => {
    try {
        const canRegister = await User.checkUserCount();
        if (!canRegister) {
            return res.status(400).json({ message: 'Maximum user limit reached (7 users)' });
        }

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = new User({ email, password });
        await user.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

/* Login route with added logging */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email);
        const user = await User.findOne({ email });
        console.log('User found:', !!user);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        res.json({ message: 'Logged in successfully', user: req.session.user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Get current user
router.get('/me', isAuthenticated, (req, res) => {
    res.json(req.session.user);
});

module.exports = router; 