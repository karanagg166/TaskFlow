const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const groupSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The user who created the group (Group Admin)
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Users that are members of the group
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false, // If the group is private
    },
    password: {
      type: String, // Optional password for joining private groups
    },
    joinRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Users requesting to join the group (for request-based access)
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Users who are admins of this group
      },
    ],
  }, {
    timestamps: true,
  });
  
// Pre-save middleware to hash password
groupSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next(); // Proceed to save the user
});

groupSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
  module.exports = mongoose.model('Group', groupSchema);
  