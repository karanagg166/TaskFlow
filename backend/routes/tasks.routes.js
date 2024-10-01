const express = require("express");
const router = express.Router(); 
const {getTaskCounts, create_personal_task, all_tasks, specific_tasks, change_status}=require('../controllers/task.controller');
router.route("/:id/taskcount").get(getTaskCounts);
router.route("/createtask").post(create_personal_task);
router.route("/:id/alltasks").get(all_tasks);
router.route("/:id/specifictasks").get(specific_tasks);
router.route("/:taskId/change_status").post(change_status);
module.exports = router; 