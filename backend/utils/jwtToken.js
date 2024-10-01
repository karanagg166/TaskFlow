const sendToken = (user, statusCode, res) => {
    // Generate token using the user method
    const token = user.getJWTToken();
    
    // Set cookie options if you want to send it as a cookie (optional)
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    // Send response
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token, // Send token in the response body (if needed)
    });
};

module.exports = sendToken;
