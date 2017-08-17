'use strict'

var express = require('express');
var router = express.Router();
const sequelize = require('../database');
const Day = sequelize.import("../models/day");

// Return list of days
router.get('/', (req, res, next) => {
    console.log('get all days');
    Day.findAll().then(days => {
        res.send(days);
    });
});

// Receive list of days
router.post('/', (req, res, next) => {
    var retStatus = 200;
    var days = req.body;

    return sequelize.transaction ((t) => {
        // Delete all days and recreate all
        return Day.destroy({where: {}}, {transaction: t}).then(() => {
            return Day.bulkCreate(days, {transaction: t}).then(() => {
                console.log("succes day bulkCreate")
                res.sendStatus(retStatus);
            }).catch(error => {
                console.log("error day bulkCreate : " + error)
                retStatus = 400;
                res.sendStatus(retStatus);
            });
        });
    });
});

module.exports = router;