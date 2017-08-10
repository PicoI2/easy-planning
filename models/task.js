"use strict";

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("task", {
        title: DataTypes.STRING,
        leftTodo: DataTypes.INTEGER,
        deadline: DataTypes.DATEONLY
    });
};