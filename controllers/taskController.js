"use strict";
const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
    try {
        // Find task based on user
        const tasks = await Task.find({ createdBy: req.userId });
        // Return user tasks
        res.json(tasks);
    } catch (err) {
        // Return err message
        res.status(500).json({ error: err.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        // Extract task details from the request body
        const { title, description, dueDate, status } = req.body;

        // Store task details in Tasks collection
        const task = new Task({
            title,
            description,
            dueDate,
            status,
            createdBy: req.userId,
        });
        await task.save();

        // Return inserted task record details
        res.json(task);
    } catch (err) {
        // Return err message
        res.status(500).json({ error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        // Get taskId related details from the request params
        const { taskId } = req.params;
        if (!taskId) {
            throw new Error('taskId not specified!');
        }
        // Get request body details to update task details
        const { title, description, dueDate, status } = req.body;

        // Update task details in Tasks collection
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { title, description, dueDate, status },
            { new: true }
        );

        // Return updated task details
        res.json(updatedTask);
    } catch (err) {
        // Return err message
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        // Get taskId to delete the task
        const { taskId } = req.params;
        if (!taskId) {
            throw new Error('taskId not specified!');
        }
        await Task.findByIdAndDelete(taskId);

        // Return success message
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        // Return err message
        res.status(500).json({ error: err.message });
    }
};
