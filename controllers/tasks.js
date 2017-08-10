var express = require('express');
var router = express.Router();
const sequelize = require('../database');
const Task = sequelize.import("../models/task");

// Return list of tasks
router.get('/', (req, res, next) => {
    console.log('get all tasks');
    Task.findAll().then(tasks => {
        console.log('I have a result');
        res.send(tasks);
    });
});

// Create a task
router.put('/', (req, res, next) => {
    console.log(req.body);
    if (req.body.title) {
        Task.create(req.body)
            .then(() => { res.sendStatus(200); })
            .catch(error => { res.sendStatus(400);});
    }
    else {
        res.sendStatus(400);
    }
});

// Delete a task
router.delete('/:id', (req, res, next) => {
    console.log(req.body);
    console.log("Will delete task " + req.params.id);
    // TODO
});

module.exports = router;