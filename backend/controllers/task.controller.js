const Task = require('../models/task.model'); // Assuming your Task model is already created
const catchAsyncErrors = require('../middleware/CatchAsyncError');
const mongoose = require('mongoose');
const { Types } = mongoose;
const Group = require('../models/group.model');
exports.getTaskCounts = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    console.log(id);

    const taskCounts = await Task.aggregate([
        {
            $match: { assignedUser: new Types.ObjectId(id) } // Filter tasks by assigned user ID
        },
        {
            $group: {
                _id: {
                    status: '$status',
                    priority: '$priority'
                },
                count: { $sum: 1 } // Count the number of tasks for each status and priority
            }
        },
        {
            $group: {
                _id: '$_id.status', // Group by status
                total: { $sum: '$count' }, // Total tasks per status
                priorities: {
                    $push: { priority: '$_id.priority', count: '$count' } // Push the priority counts
                }
            }
        },
        {
            $project: {
                _id: 0,
                status: '$_id',
                total: 1,
                priorities: 1
            }
        }
    ]);

   

    // Initialize result structure
    const result = {
        Pending: {
            total: 0,
            Low: 0,
            Medium: 0,
            High: 0
        },
        InProgress: {
            total: 0,
            Low: 0,
            Medium: 0,
            High: 0
        },
        Completed: {
            total: 0,
            Low: 0,
            Medium: 0,
            High: 0
        }
    };

    // Populate the result object with the data from the aggregation
    taskCounts.forEach((group) => {
        const status = group.status;
        result[status].total = group.total; // Set total count for each status

        group.priorities.forEach((task) => {
            result[status][task.priority] = task.count; // Store counts based on priority
        });
    });

    return res.json(result); // Return the structured result
});
exports.create_personal_task=catchAsyncErrors(async(req,res,next)=>{

    
    const { title,
        description,
        dueDate,
        status,
        priority,
        assignedUser,
        group,createdBy}=req.body;
        console.log("ho");
const task=await Task.create({


    title,
    description,
    dueDate,
    createdBy,
    status,
    priority,
    assignedUser,
    group
})
res.status(200).json({
    success: true,
   task
  });

});
exports.all_tasks=catchAsyncErrors(async(req,res,next)=>{

const {id}=req.params;
const tasks = await Task.find({ assignedUser: id }).sort({ createdAt: -1 });
res.status(200).json({
    success: true,
    tasks
})


});
exports.specific_tasks = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { dueDate, createTaskDate, assignedBy, groupName, status, priority } = req.query; // Use req.query for filters
    
    
    // Find tasks assigned to a specific user
    let query = { assignedUser: id };

    // Build query based on provided parameters
    if (dueDate) {
        // Convert dueDate to proper format to compare
        const formattedDueDate = new Date(dueDate).toISOString().split('T')[0];
        query.dueDate = { $gte: formattedDueDate };
    }
    
    if (createTaskDate) {
        // Convert createTaskDate to proper format and compare
        const formattedCreateTaskDate = new Date(createTaskDate).toISOString().split('T')[0];
        query.createdAt = { $gte: formattedCreateTaskDate };
    }

    if (assignedBy) {
        // Find the user by name (case-insensitive) to filter tasks assigned by this user
        const assignedUser = await User.findOne({ name: { $regex: new RegExp(assignedBy, 'i') } });
        if (assignedUser) {
            query.createdBy = assignedUser._id; // Add the found user's ID to the query
        } else {
            return res.status(404).json({
                success: false,
                message: 'Assigned user not found.',
            });
        }
    }

    if (status) {
        // Direct match or case-insensitive filtering of task status
        query.status = { $regex: new RegExp(status, 'i') };
    }

    if (priority) {
        // Case-insensitive filter for priority
        query.priority = { $regex: new RegExp(priority, 'i') };
    }

    // Check for groupId or groupName
    if (groupName) {
        const group = await Group.findOne({ name: { $regex: new RegExp(groupName, 'i') } }); // Find the group by name (case-insensitive)
        if (group) {
            query.group = group._id; // If the group exists, add it to the query
        }
    }

    // Fetch tasks based on the constructed query
    const tasks = await Task.find(query).populate('assignedUser createdBy group'); // Populate fields for better readability

    // Check if tasks are found
   

    // Respond with the tasks
    res.status(200).json({
        success: true,
        tasks,
    });
});
exports.change_status=catchAsyncErrors(async(req,res,next)=>{
const {taskId}=req.params;
const {newStatus}=req.body;
const task=await Task.findOne({_id:taskId});

task.status=newStatus;
res.status(200).json(
{
    success:true,
    task
}
)

})