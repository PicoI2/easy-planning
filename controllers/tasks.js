'use strict'

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

// Receive list of tasks
router.post('/', (req, res, next) => {
    console.log(req.body);
    var promList = [];
    var tasks = req.body;
    var retStatus = 200;
    for (var it in tasks) {
        var task = tasks[it];
        if (0 < task.id) {
            var prom = Task.update(task, {where: {id: task.id}})
                .catch(error => {
                    console.log("error task update : " + error)
                    retStatus = 400;
                });
            promList.push(prom);
        }
        else if (task.title) {
            var prom = Task.create(task)
                .catch(error => {
                    console.log("error task create : " + error)
                    retStatus = 400;
                });
            promList.push(prom);
        }
    }
    Promise.all(promList).then(()=>{
        console.log("End promise.all");
        res.sendStatus(retStatus);
    });
});

// Delete a task
router.delete('/:id', (req, res, next) => {
    console.log(req.body);
    console.log("Will delete task " + req.params.id);
    // TODO
});

module.exports = router;