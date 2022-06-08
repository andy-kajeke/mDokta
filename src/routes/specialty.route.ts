import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { SpecialtyInstance } from '../models/specialty.model';
import { DoctorSpecialtyInstance } from '../models/doctorSpecialty.model';
const { checkAccessToken } = require('../auth/validationToken');
const SpecialtyRoute = express.Router();
import cors from'cors';

SpecialtyRoute.use(cors());

/**specialty icon */
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./specialty_photos");
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage })

/***************************************************************************
 *  Add new specailty
 * *************************************************************************/
SpecialtyRoute.post('/add_new', checkAccessToken, async(req: Request, res: Response) => {
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

    const specialty_id = crypto.randomUUID();

    let specialtyData = {
        id: specialty_id,
        specialty_name: req.body.specialty_name,
        specialty_icon: 'http://localhost:2222/specialty_icon/sp_icon1.png',
        created_at: today + ' ' + currentTime,
        updated_at: today + ' ' + currentTime,
    }

    await SpecialtyInstance.findOne(
        {
            where: {
                specialty_name: req.body.specialty_name,
            }
        }
    ).then((specialty) => {
        if(!specialty){
            SpecialtyInstance.create(specialtyData)
            .then((specialty: any) => {
                res.json({response: {
                    status: "success",
                    message: specialty.specialty_name + ' has been added successfully..!'
                }});
            })
            .catch((error) => {
                res.json({response: {
                    status: "failed",
                    message: error
                }});
            });
        }
        else{
            res.json({response: {
                status: "failed",
                message: 'Specialty already exists'
            }});
        }
    })
    .catch((error) => {
        res.json({response: {
            status: "failed",
            message: error
        }});
    });
});

/***************************************************************************
 *  Get all specailties
 * *************************************************************************/
SpecialtyRoute.get('/', checkAccessToken, async(req: Request, res: Response) => {
    try {
        const records = await SpecialtyInstance.findAll({
            order: [
                ['specialty_name', 'ASC']
            ]
        });
        return res.json({response: {
            status: "success",
            specialties: records
        }});
    } catch (error) {
        return res.json({response: {
            status: "failed",
            message: error
        }});
    }
});

/***************************************************************************
 *  Get specailty by ID
 * *************************************************************************/
SpecialtyRoute.get('/:id', checkAccessToken, async(req: Request, res: Response) => {
    try {
        await SpecialtyInstance.findOne({
            where: {
                id: req.params.id
            }
        })
        .then((record) => {
            if(record){
                res.json({response: {
                    status: "success",
                    specialty: record
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
 *  Update specailty info by ID
 * *************************************************************************/
SpecialtyRoute.put('/update/:id', checkAccessToken, async(req: Request, res: Response) => {
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

    let specialtyData = {
        specialty_name: req.body.specialty_name,
        updated_at: today + ' ' + currentTime,
    }

    try {
        await SpecialtyInstance.findOne(
            {
                where: {
                    id: req.params.id,
                }
            }
        ).then((record) => {
            if(record){
                SpecialtyInstance.update(specialtyData, {
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
 *  Edit specialty icon
 * *************************************************************************/
SpecialtyRoute.put('/update/specialty_icon/:id', upload.single('specialty_icon'), async(req: Request, res: Response) => {
    try {
        await SpecialtyInstance.update({
            specialty_icon: 'http://localhost:2222/specialty_icon/' + req.file?.originalname,
        },{
            where:{
                id: req.params.id 
            }
        }).then((record: any) => {
            if(record){
                res.json({response: {
                    status: 'success',
                    message: 'Profile pic updated successfully'
                }});
            }
            else{
                res.json({response: {
                    status: 'failed',
                    message: 'Record not found'
                }});
            }
        })
        .catch(error => {
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
 *  Delete specailty info by ID
 * *************************************************************************/
SpecialtyRoute.delete('/delete/:id', checkAccessToken, async(req: Request, res: Response) => {
    try {
        await SpecialtyInstance.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(record => {
            if(record === 1){
                res.json({response: {
                    status: 'success', 
                    message: 'Record Deleted Successfully..!'
                }});
            }else{
                res.json({response: {
                    status: 'failed', 
                    message: 'Recode not found'
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
        res.json({
            status: 'failed',
            message: error
        });
    }
});

/***************************************************************************
 *  Add Doctor specailty 
 * *************************************************************************/
SpecialtyRoute.post('/doctor/add_new', checkAccessToken, async(req: Request, res: Response) => {
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

    const specialty_id = crypto.randomUUID();

    let doctorSpecialtyData = {
        id: specialty_id,
        doctor_id: req.body.doctor_id,
        specialty_name: req.body.specialty_name,
        // created_at: today + ' ' + currentTime,
        // updated_at: today + ' ' + currentTime,
    }

    await DoctorSpecialtyInstance.findOne(
        {
            where: {
                doctor_id: req.body.doctor_id,
                specialty_name: req.body.specialty_name
            }
        }
    ).then((specialty) => {
        if(!specialty){
            DoctorSpecialtyInstance.create(doctorSpecialtyData)
            .then((specialty: any) => {
                res.json({response: {
                    status: "success",
                    message: 'Record has been added successfully..!'
                }});
            })
            .catch((error) => {
                res.json({response: {
                    status: "failed",
                    message: error
                }});
            });
        }
        else{
            res.json({response: {
                status: "failed",
                message: 'Record already exists'
            }});
        }
    })
    .catch((error) => {
        res.json({response: {
            status: "failed",
            message: error
        }});
    });
});

module.exports = SpecialtyRoute;