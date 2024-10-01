const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'InProgress', 'Completed'],
    default: 'Pending',
  },
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User assigned to the task
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User who created the task
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group', // Group that this task belongs to
    
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
