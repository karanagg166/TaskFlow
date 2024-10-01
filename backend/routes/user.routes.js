const { isauthenticateuser, authorizeroles } = require("../middleware/auth");
const express = require("express");
const {registerUser,loginUser,userinfo}=require('../controllers/user.controller');
const router = express.Router(); 
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user/:id/userinfo").get(userinfo);


module.exports = router; 