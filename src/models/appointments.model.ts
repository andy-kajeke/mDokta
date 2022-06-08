import Sequelize, { Model } from "sequelize";
import db from "../config/db_config";

interface AppointmentAttributes {
    id: string,
    patient_id: string,
    doctor_id: string,
    specialty_id: string,
    appointmentDate: string,
    appointmentTime: string,
    appointmentDescription: string,
    appointmentStatus: string,
    created_at: string,
    updated_at: string
};

export class AppointmentInstance extends Model<AppointmentAttributes> {};

AppointmentInstance.init(
    {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        patient_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        doctor_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        specialty_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        appointmentDate: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        appointmentTime: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        appointmentDescription: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        appointmentStatus: {
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
        tableName: 'appointments',
        timestamps: false
    }
);