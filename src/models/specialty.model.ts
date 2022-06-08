import Sequelize, { Model } from "sequelize";
import db from "../config/db_config";

interface SpecialtyAttributes {
    id: string,
    specialty_name: string,
    specialty_icon: string,
    created_at: string,
    updated_at: string
};

export class SpecialtyInstance extends Model<SpecialtyAttributes> {};

SpecialtyInstance.init(
    {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        specialty_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        specialty_icon: {
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
        tableName: 'specialties',
        timestamps: false
    }
);