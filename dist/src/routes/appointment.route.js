"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const AppointmentRoute = express_1.default.Router();
const cors_1 = __importDefault(require("cors"));
const appointments_model_1 = require("../models/appointments.model");
const { checkAccessToken } = require('../auth/validationToken');
AppointmentRoute.use((0, cors_1.default)());
/***************************************************************************
 *  Add new appointment
 * *************************************************************************/
AppointmentRoute.post('/add_request', checkAccessToken, async (req, res) => {
    var date = new Date();
    let today = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var realHour = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? 0 + minutes : minutes;
    seconds = seconds < 10 ? 0 + seconds : seconds;
    var currentTime = realHour + ':' + minutes + ':' + seconds + ' ' + ampm;
    const appoitment_id = crypto_1.default.randomUUID();
    let appointmentData = {
        id: appoitment_id,
        patient_id: req.body.patient_id,
        doctor_id: req.body.doctor_id,
        specialty_id: req.body.specialty_id,
        appointmentDate: 'Pending',
        appointmentTime: 'Pending',
        appointmentDescription: req.body.appointmentDescription,
        appointmentStatus: 'Pending',
        created_at: today + ' ' + currentTime,
        updated_at: today + ' ' + currentTime,
    };
    await appointments_model_1.AppointmentInstance.create(appointmentData)
        .then((appointment) => {
        res.json({ response: {
                status: "success",
                message: 'Your appointment request has been submitted successfully..! \nThank you.'
            } });
    })
        .catch((error) => {
        res.json({ response: {
                status: "failed",
                message: error
            } });
    });
});
/***************************************************************************
 *  Get All appointments
 * *************************************************************************/
AppointmentRoute.get('/', checkAccessToken, async (req, res) => {
    try {
        const records = await appointments_model_1.AppointmentInstance.findAll({
            order: [
                ['created_at', 'DESC']
            ]
        });
        return res.json({ response: {
                status: "success",
                appointments: records
            } });
    }
    catch (error) {
        return res.json({ response: {
                status: "failed",
                message: error
            } });
    }
});
/***************************************************************************
 *  Get appointments by ID
 * *************************************************************************/
AppointmentRoute.get('/:id', checkAccessToken, async (req, res) => {
    try {
        await appointments_model_1.AppointmentInstance.findOne({
            where: {
                id: req.params.id
            }
        })
            .then((record) => {
            if (record) {
                res.json({ response: {
                        status: "success",
                        appointment: record
                    } });
            }
            else {
                res.json({ response: {
                        status: "failed",
                        message: 'Record not found'
                    } });
            }
        });
    }
    catch (error) {
        return res.json(error);
    }
});
/***************************************************************************
 *  Update appointment info by ID for doctor aproval
 * *************************************************************************/
AppointmentRoute.put('/update/doctor/:id', checkAccessToken, async (req, res) => {
    var date = new Date();
    let today = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var realHour = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? 0 + minutes : minutes;
    seconds = seconds < 10 ? 0 + seconds : seconds;
    var currentTime = realHour + ':' + minutes + ':' + seconds + ' ' + ampm;
    let appointmentData = {
        appointmentDate: req.body.appointmentDate,
        appointmentTime: req.body.appointmentTime,
        appointmentStatus: req.body.appointmentStatus,
        updated_at: today + ' ' + currentTime,
    };
    try {
        await appointments_model_1.AppointmentInstance.findOne({
            where: {
                id: req.params.id,
            }
        }).then((record) => {
            if (record) {
                appointments_model_1.AppointmentInstance.update(appointmentData, {
                    where: { id: req.params.id }
                })
                    .then(() => {
                    res.json({ response: {
                            status: 'success',
                            message: 'Record updated successfully..!'
                        } });
                })
                    .catch((error) => {
                    res.json({ response: {
                            status: 'failed',
                            message: error
                        } });
                });
            }
            else {
                res.json({ response: {
                        status: 'failed',
                        message: 'Record not found'
                    } });
            }
        })
            .catch((error) => {
            res.json({ response: {
                    status: 'failed',
                    message: error
                } });
        });
    }
    catch (error) {
        res.json({ response: {
                status: 'failed',
                message: error
            } });
    }
});
/***************************************************************************
 *  Update appointment info by ID for patient
 * *************************************************************************/
AppointmentRoute.put('/update/patient/:id', checkAccessToken, async (req, res) => {
    let appointmentData = {
        appointmentDescription: req.body.appointmentDescription
    };
    try {
        await appointments_model_1.AppointmentInstance.findOne({
            where: {
                id: req.params.id,
            }
        }).then((record) => {
            if (record) {
                appointments_model_1.AppointmentInstance.update(appointmentData, {
                    where: { id: req.params.id }
                })
                    .then(() => {
                    res.json({ response: {
                            status: 'success',
                            message: 'Record updated successfully..!'
                        } });
                })
                    .catch((error) => {
                    res.json({ response: {
                            status: 'failed',
                            message: error
                        } });
                });
            }
            else {
                res.json({ response: {
                        status: 'failed',
                        message: 'Record not found'
                    } });
            }
        })
            .catch((error) => {
            res.json({ response: {
                    status: 'failed',
                    message: error
                } });
        });
    }
    catch (error) {
        res.json({ response: {
                status: 'failed',
                message: error
            } });
    }
});
module.exports = AppointmentRoute;
