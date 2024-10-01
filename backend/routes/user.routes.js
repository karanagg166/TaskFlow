const { isauthenticateuser, authorizeroles } = require("../middleware/auth");
const express = require("express");
const {registerUser,loginUser,userinfo}=require('../controllers/user.controller');
const router = express.Router(); 
const Group = require('../models/group.model'); // Import your Group model
const mongoose = require('mongoose');
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user/:id/userinfo").get(userinfo);

const isAuthenticated = require('../middleware/auth'); // Adjust the path as necessary
router.get('/protected-resource', isAuthenticated, (req, res) => {
    res.status(200).json({ success: true, message: 'You have access to this protected resource.', user: req.user });
});
  
 
  
module.exports = router; 