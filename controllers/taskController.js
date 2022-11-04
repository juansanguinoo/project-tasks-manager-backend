const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { project } = req.body;

    const existProject = await Project.findById(project);
    if (!existProject) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (existProject.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const task = new Task(req.body);
    await task.save();
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send('There was an error');
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { project } = req.query;

    const existProject = await Project.findById(project);
    if (!existProject) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (existProject.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const tasks = await Task.find({ project }).sort({ created: -1 });
    res.json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send('There was an error');
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { project, name, state } = req.body;

    let existTasks = await Task.findById(req.params.id);

    if (!existTasks) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const existProject = await Project.findById(project);

    if (existProject.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const newTask = {};
    newTask.name = name;
    newTask.state = state;

    existTask = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, {
      new: true,
    });

    res.json({ existTask });
  } catch (error) {
    console.log(error);
    res.status(500).send('There was an error');
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { project } = req.query;

    let existTasks = await Task.findById(req.params.id);
    if (!existTasks) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const existProject = await Project.findById(project);
    if (existProject.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Task.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: 'Task deleted' });
  } catch (error) {}
};
