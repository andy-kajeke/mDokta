import Sequelize, { Model } from "sequelize";
import db from "../config/db_config";

interface DoctorSpecialtyAttributes {
    id: string,
    doctor_id: string,
    specialty_name: string,
    // created_at: string,
    // updated_at: string
};

export class DoctorSpecialtyInstance extends Model<DoctorSpecialtyAttributes> {};

DoctorSpecialtyInstance.init(
    {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        doctor_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        specialty_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        // created_at: {
        //     type: Sequelize.STRING,
        //     allowNull: false,
        // },
        // updated_at: {
        //     type: Sequelize.STRING,
        //     allowNull: false,
        // }
    },
    {
        sequelize: db,
        tableName: 'doctors_specialities',
        timestamps: false
    }
);