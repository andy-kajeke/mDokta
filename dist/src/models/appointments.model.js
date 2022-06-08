"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentInstance = void 0;
const sequelize_1 = __importStar(require("sequelize"));
const db_config_1 = __importDefault(require("../config/db_config"));
;
class AppointmentInstance extends sequelize_1.Model {
}
exports.AppointmentInstance = AppointmentInstance;
;
AppointmentInstance.init({
    id: {
        type: sequelize_1.default.STRING,
        primaryKey: true,
        allowNull: false
    },
    patient_id: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    doctor_id: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
    specialty_id: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
    appointmentDate: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
    appointmentTime: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
    appointmentDescription: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
    appointmentStatus: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
    created_at: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
    updated_at: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    }
}, {
    sequelize: db_config_1.default,
    tableName: 'appointments',
    timestamps: false
});
