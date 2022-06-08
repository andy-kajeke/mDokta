"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    // dialectOptions: {
    //     options: {
    //         encrypt: true,
    //     }
    // },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
exports.default = db;
