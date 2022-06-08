import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
const AppointmentRoute = express.Router();
import cors from'cors';
import { AppointmentInstance } from '../models/appointments.model';
const { checkAccessToken } = require('../auth/validationToken');

AppointmentRoute.use(cors());

/***************************************************************************
 *  Add new appointment
 * *************************************************************************/
AppointmentRoute.post('/add_request', checkAccessToken, async(req: Request, res: Response) => {
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

    const appoitment_id = crypto.randomUUID();

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
    }

    await AppointmentInstance.create(appointmentData)
    .then((appointment: any) => {
        res.json({response: {
            status: "success",
            message: 'Your appointment request has been submitted successfully..! \nThank you.'
        }});
    })
    .catch((error) => {
        res.json({response: {
            status: "failed",
            message: error
        }});
    });
});

/***************************************************************************
 *  Get All appointments
 * *************************************************************************/
AppointmentRoute.get('/', checkAccessToken, async(req: Request, res: Response) => {
    try {
        const records = await AppointmentInstance.findAll({
            order: [
                ['created_at', 'DESC']
            ]
        });
        return res.json({response: {
            status: "success",
            appointments: records
        }});
    } catch (error) {
        return res.json({response: {
            status: "failed",
            message: error
        }});
    }
});

/***************************************************************************
 *  Get appointments by ID
 * *************************************************************************/
AppointmentRoute.get('/:id', checkAccessToken, async(req: Request, res: Response) => {
    try {
        await AppointmentInstance.findOne({
            where: {
                id: req.params.id
            }
        })
        .then((record) => {
            if(record){
                res.json({response: {
                    status: "success",
                    appointment: record
                }});
            }
            else{
                res.json({response: {
                    status: "failed",
                    message: 'Record not found'
                }});
            }
        })
    } catch (error) {
        return res.json(error);
    }
});

/***************************************************************************
 *  Update appointment info by ID for doctor aproval
 * *************************************************************************/
AppointmentRoute.put('/update/doctor/:id', checkAccessToken, async(req: Request, res: Response) => {
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
    }

    try {
        await AppointmentInstance.findOne(
            {
                where: {
                    id: req.params.id,
                }
            }
        ).then((record) => {
            if(record){
                AppointmentInstance.update(appointmentData, {
                    where: { id: req.params.id}
                })
                .then(() => {
                    res.json({response: {
                        status: 'success',
                        message: 'Record updated successfully..!'
                    }});
                })
                .catch((error) => {
                    res.json({response: {
                        status: 'failed',
                        message: error
                    }});
                });
            }
            else{
                res.json({response: {
                    status: 'failed',
                    message: 'Record not found'
                }});
            }
        })
        .catch((error) => {
            res.json({response: {
                status: 'failed',
                message: error
            }});
        });
    } catch (error) {
        res.json({response: {
            status: 'failed',
            message: error
        }});
    }
});

/***************************************************************************
 *  Update appointment info by ID for patient
 * *************************************************************************/
AppointmentRoute.put('/update/patient/:id', checkAccessToken, async(req: Request, res: Response) => {

    let appointmentData = {
        appointmentDescription: req.body.appointmentDescription
    }

    try {
        await AppointmentInstance.findOne(
            {
                where: {
                    id: req.params.id,
                }
            }
        ).then((record) => {
            if(record){
                AppointmentInstance.update(appointmentData, {
                    where: { id: req.params.id}
                })
                .then(() => {
                    res.json({response: {
                        status: 'success',
                        message: 'Record updated successfully..!'
                    }});
                })
                .catch((error) => {
                    res.json({response: {
                        status: 'failed',
                        message: error
                    }});
                });
            }
            else{
                res.json({response: {
                    status: 'failed',
                    message: 'Record not found'
                }});
            }
        })
        .catch((error) => {
            res.json({response: {
                status: 'failed',
                message: error
            }});
        });
    } catch (error) {
        res.json({response: {
            status: 'failed',
            message: error
        }});
    }
});

module.exports = AppointmentRoute;