"use strict";

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("day", {
        day: DataTypes.DATEONLY,
        load: DataTypes.FLOAT,
        off: DataTypes.BOOLEAN,
        weekend: DataTypes.BOOLEAN
    });
};
