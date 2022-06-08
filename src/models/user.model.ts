import Sequelize, { Model } from "sequelize";
import db from "../config/db_config";

interface UserAttributes {
    id: string,
    userType: string,
    userStatus: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    profilePhoto: string,
    password: string,
    resetCode: string,
    created_at: string,
    updated_at: string
};

export class UserInstance extends Model<UserAttributes> {};

UserInstance.init(
    {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        userType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        userStatus: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        profilePhoto: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        resetCode: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        created_at: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        updated_at: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    },
    {
        sequelize: db,
        tableName: 'users',
        timestamps: false
    }
);