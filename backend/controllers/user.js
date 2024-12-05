const User = require('../models/UserModel');

// Add a new user (Sign-Up)
exports.addUser = async (req, res) => {
    console.log(req.body); // Log the incoming request body
    const { name, email } = req.body;
    try {
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists!' });
        }

        const newUser = new User({ name, email });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error); // Log the error for further inspection
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Sign in a user (Authenticate by name)
exports.signinUser = async (req, res) => {
    const { name } = req.body;
    try {
        // Check if a user with the provided name exists
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(400).json({ message: 'User not found!' });
        }

        res.status(200).json({ message: 'Signed in successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error signing in', error });
    }
};

// Get all users (for admin purposes)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
