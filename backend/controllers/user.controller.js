const User = require('../models/user.model'); // Adjust the path as necessary
const sendToken = require('../utils/jwtToken'); // Assuming you have a sendToken utility
const catchAsyncErrors = require('../middleware/CatchAsyncError'); // Use the correct casing

// Controller to register a new user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { username, email, password ,name} = req.body;

    const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] // Check for existing email or username
    });

    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: 'User already exists with this email or username.',
        });
    }
    const user = await User.create({
        username,
        email,
        name,
        password, // Make sure to hash the password before saving (not shown here)
    });

    // Send token and response
    sendToken(user, 201, res); // Send token and respond with user data
});
// Controller to log in a user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username:username });
    
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }

    // Check if the password is correct
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }

    // Send token and response
    sendToken(user, 200, res); // Send token and respond with user data
});

exports.userinfo = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
  
    // Find user by id
    const user = await User.findOne({ _id: id });
    
    // If user is not found, return error response
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  
    // Send user information as JSON
    res.status(200).json({
      success: true,
      user,
    });
  });


