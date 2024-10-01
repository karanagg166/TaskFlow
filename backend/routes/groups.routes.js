const express = require("express");
const router = express.Router(); 
const {create_group, allgroups, all_users, all_tasks, join_user}=require('../controllers/groups.controller');
router.route("/:id/create_group").post(create_group);
router.route("/:id/all_groups").get(allgroups);
router.route("/:groupId/:id/members").get(all_users);
router.route("/:groupId/:id/tasks").get(all_tasks);
router.route("/:groupId/:id/join_group").post(join_user);
module.exports = router; 