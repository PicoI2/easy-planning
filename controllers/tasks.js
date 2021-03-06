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
    var retStatus = 200;
    var tasks = req.body;

    return sequelize.transaction ((t) => {
        // Delete all days and recreate all
        return Task.destroy({where: {}}, {transaction: t}).then(() => {
            return Task.bulkCreate(tasks, {transaction: t}).then(() => {
                console.log("succes task bulkCreate")
                res.sendStatus(retStatus);
            }).catch(error => {
                console.log("error task bulkCreate : " + error)
                retStatus = 400;
                res.sendStatus(retStatus);
            });
        });
    });
});

module.exports = router;