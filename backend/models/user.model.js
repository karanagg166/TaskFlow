const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User schema definition
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true ,unique:true},
    email: { type: String, required: true, unique: true }, // Ensure email is unique
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now } ,
    groups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group', // Reference to the Group model
        },
    ],
    
});

// Method to generate JWT token
userSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Proceed to save the user
});

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
