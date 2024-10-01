const Task = require('../models/task.model'); // Assuming your Task model is already created

const catchAsyncErrors = require('../middleware/CatchAsyncError');
const Group = require('../models/group.model');
const User = require('../models/user.model'); 
const mongoose =require('mongoose');
const { ObjectId } = require('mongoose').Types;
const { createObjectCsvWriter } = require('csv-writer');
exports.create_group = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params; // User ID from params
    const { name, description, isPrivate, password } = req.body; // Destructure request body

    // Validate required fields
    if (!name || !isPrivate || (isPrivate && !password)) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.',
        });
    }

    // Create a new group
    const group = await Group.create({
        name,
        description,
        isPrivate,
        password: isPrivate ? password : undefined, // Set password only if the group is private
        createdBy: id, // Set the creator of the group
        admins: [id],
       
    });

    // Push the new group ID into the user's groups array
    await User.findByIdAndUpdate(
        id,
        { $push: { groups: group._id } }, // Add the group ID to the user's groups
        { new: true } // Return the updated user document
    );

    res.status(201).json({
        success: true,
        group,
    });
});
exports.allgroups = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params; 

    
    const user = await User.findById(id).populate('groups'); // Populate the groups

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found.',
        });
    }

    // Get the group's IDs from the user
    const userGroupIds = user.groups.map(group => group._id); // Extract group IDs

    // Find groups where the group ID is in the user's groups
    const groups = await Group.find({ _id: { $in: userGroupIds } })
    .populate({
        path: 'createdBy',  // Populate the creator's information
        select: 'name'      // Only get the name field
    });

    res.status(200).json({
        success: true,
        groups,
    });
});

exports.all_tasks=catchAsyncErrors(async(req,res,next)=>{

const {id,groupId}=req.params;

const group=await Group.find({_id:groupId});

if (!group) {
    return res.status(404).json({
        success:false,
        message: 'Group not found' });
}

const objectIdToCompare = new mongoose.Types.ObjectId(id); // Convert id to ObjectId

let isAdmin = false;

group.forEach(grou => {
  grou.admins.forEach(admin => {
    if (admin._id.equals(objectIdToCompare)) { // Use .equals for ObjectId comparison
      isAdmin = true;
    }
  });
});

console.log("isAdmin:", isAdmin,id); // Log the isAdmin result
let tasks;
if (isAdmin) {
    // If the user is an admin, return all tasks in the group
    tasks = await Task.find({ group:groupId });
} else {
    // Otherwise, return only tasks assigned to the user (id)
    tasks = await Task.find({ group:groupId,  assignedUser: id });
}
const x=await Task.find({ group:groupId });

res.status(200).json({ success: true, tasks });

});
exports.all_users = catchAsyncErrors(async (req, res, next) => {
    const { groupId, id } = req.params; // id represents the current user's ID
    console.log(groupId, id);

    // Find the group by groupId and populate members and admins
    const group = await Group.findById(groupId)
        .populate('members', 'name email username') // Assuming 'members' is an array of user references
        .populate('admins', 'name email username'); // Assuming 'admins' is also an array of user references

    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }
    
   

    // Check if the current user (id) is a member or an admin of the group
    const isMember = group.members && group.members.length > 0 
        ? group.members.some(member => member._id.equals((id))) 
        : false; // Set to false if members array is empty or undefined

    const isAdmin = group.admins && group.admins.length > 0 
        ? group.admins.some(admin => admin._id.equals((id))) 
        : false; // Set to false if admins array is empty or undefined

    if (!isMember && !isAdmin) {
        return res.status(403).json({ message: 'You are not a member or admin of this group' });
    }

    // Prepare the response with members and their admin status
   const admins=group.admins;
   const members=group.members;

    res.status(200).json({ success: true, members, admins });
});
exports.join_user = catchAsyncErrors(async (req, res, next) => {
    const { id, groupId } = req.params;
    const { password } = req.body; // Get password from request body

    // Find the group by groupId
    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the group is private
    if (group.isPrivate) {
        // Verify the provided password
        const isPasswordCorrect = await group.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password for this group' });
        }
    }

    // Ensure that members is an array
    if (!Array.isArray(group.members)) {
        group.members = []; // Initialize members as an empty array if it's not
    }

    // Check if the user is already a member or admin
    const isMember = group.members.some(member => member.toString() === id);
    const isAdmin = Array.isArray(group.admins) && group.admins.some(admin => admin.toString() === id);

    if (isMember || isAdmin) {
        return res.status(200).json({ success:false,message: 'User is already in the group' });
    }

    // Add the user to the group members
    group.members.push(id);
    await group.save();

    // Update the user's groups field
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.groups.push(groupId);
    await user.save();

    return res.status(200).json({ message: 'User added to group successfully' });
});
exports.groupinfo = catchAsyncErrors(async (req, res, next) => {
    const { groupId } = req.params;
  
    // Find the group and populate the createdBy field
    const group = await Group.findOne({ _id: groupId })
      .populate('createdBy', 'name') // Assuming 'createdBy' is a reference to a User model
      .select('name description createdBy createdAt');
  
    // Check if the group exists
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found.' });
    }
  
    // Respond with the group information, including user name
    return res.status(200).json({ 
      success: true, 
      group // This will be a single group object
    });
});

  exports.getAllGroups = catchAsyncErrors(async (req, res, next) => {
    // Fetch all groups, selecting only the name and ID
    const groups = await Group.find({}, { _id: 1, name: 1 }); // Only select the ID and name fields
  
    // If no groups found, return an appropriate message
    if (!groups.length) {
      return res.status(404).json({ success: false, message: 'No groups found.' });
    }
  
    // Respond with the list of groups
    return res.status(200).json({ success: true, groups });
  });
 
exports.report = catchAsyncErrors(async (req, res, next) => {
    const { id, groupId } = req.params;

    // Retrieve the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(404).json({
            success: false,
            message: 'Group not found',
        });
    }

    // Check if the user is an admin
    const isAdmin = group.admins.some(admin => admin._id.equals(id)); // Use .some() for efficiency
    if (!isAdmin) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized",
        });
    }

    const { dueDate, createTaskDate, assignedBy, status, priority } = req.query;

    // Find tasks in the group
    const tasks = await Task.find({ group: group._id });
    
    // Filter tasks based on provided parameters
    const filteredTasks = tasks.filter(task => {
        let isValid = true;

        // Check for dueDate filter
        if (dueDate) {
            const formattedDueDate = new Date(dueDate);
            if (new Date(task.dueDate) < formattedDueDate) {
                isValid = false;
            }
        }

        // Check for createTaskDate filter
        if (createTaskDate) {
            const formattedCreateTaskDate = new Date(createTaskDate);
            if (new Date(task.createdAt) < formattedCreateTaskDate) {
                isValid = false;
            }
        }

        // Check for assignedBy filter
        if (assignedBy && task.createdBy) {
            if (!task.createdBy.name.toLowerCase().includes(assignedBy.toLowerCase())) {
                isValid = false;
            }
        }

        // Check for status filter
        if (status && task.status) {
            if (!task.status.toLowerCase().includes(status.toLowerCase())) {
                isValid = false;
            }
        }

        // Check for priority filter
        if (priority && task.priority) {
            if (!task.priority.toLowerCase().includes(priority.toLowerCase())) {
                isValid = false;
            }
        }

        return isValid; // Return true if the task passes all filters
    });

    // Log the filtered tasks
    console.log(filteredTasks);
    if (filteredTasks.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No tasks found.',
        });
    }

    // Create CSV writer
    const path = require('path'); // Import the path module

    // Define the path for the CSV file
    const filePath = path.join(__dirname, 'tasks_report.csv');
    
    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
        path: filePath, // Use the constructed path
        header: [
            { id: 'id', title: 'ID' },
            { id: 'title', title: 'Title' },
            { id: 'dueDate', title: 'Due Date' },
            { id: 'status', title: 'Status' },
            { id: 'priority', title: 'Priority' },
            { id: 'assignedUser', title: 'Assigned User' },
            { id: 'createdBy', title: 'Created By' },
            { id: 'group', title: 'Group' }
        ]
    });
    
    // Prepare data for CSV
    const records = filteredTasks.map(task => ({
        id: task._id,
        title: task.title,
        dueDate: task.dueDate,
        status: task.status,
        priority: task.priority,
        assignedUser: task.assignedUser?.name || 'N/A', // Handle potential null case
        createdBy: task.createdBy?.name || 'N/A', // Handle potential null case
        group: task.group?.name || 'N/A' // Handle potential null case
    }));
    
    // Write records to CSV file
    await csvWriter.writeRecords(records);
    
    // Set the response headers for CSV download
    res.header('Content-Type', 'text/csv');
    res.attachment('tasks_report.csv');
    return res.sendFile(filePath); // Use the constructed path to send the file
    
});