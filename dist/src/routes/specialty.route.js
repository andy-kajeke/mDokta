"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const specialty_model_1 = require("../models/specialty.model");
const doctorSpecialty_model_1 = require("../models/doctorSpecialty.model");
const { checkAccessToken } = require('../auth/validationToken');
const SpecialtyRoute = express_1.default.Router();
const cors_1 = __importDefault(require("cors"));
SpecialtyRoute.use((0, cors_1.default)());
/**specialty icon */
const storage = multer_1.default.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./specialty_photos");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
/***************************************************************************
 *  Add new specailty
 * *************************************************************************/
SpecialtyRoute.post('/add_new', checkAccessToken, async (req, res) => {
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
    const specialty_id = crypto_1.default.randomUUID();
    let specialtyData = {
        id: specialty_id,
        specialty_name: req.body.specialty_name,
        specialty_icon: 'http://localhost:2222/specialty_icon/sp_icon1.png',
        created_at: today + ' ' + currentTime,
        updated_at: today + ' ' + currentTime,
    };
    await specialty_model_1.SpecialtyInstance.findOne({
        where: {
            specialty_name: req.body.specialty_name,
        }
    }).then((specialty) => {
        if (!specialty) {
            specialty_model_1.SpecialtyInstance.create(specialtyData)
                .then((specialty) => {
                res.json({ response: {
                        status: "success",
                        message: specialty.specialty_name + ' has been added successfully..!'
                    } });
            })
                .catch((error) => {
                res.json({ response: {
                        status: "failed",
                        message: error
                    } });
            });
        }
        else {
            res.json({ response: {
                    status: "failed",
                    message: 'Specialty already exists'
                } });
        }
    })
        .catch((error) => {
        res.json({ response: {
                status: "failed",
                message: error
            } });
    });
});
/***************************************************************************
 *  Get all specailties
 * *************************************************************************/
SpecialtyRoute.get('/', checkAccessToken, async (req, res) => {
    try {
        const records = await specialty_model_1.SpecialtyInstance.findAll({
            order: [
                ['specialty_name', 'ASC']
            ]
        });
        return res.json({ response: {
                status: "success",
                specialties: records
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
 *  Get specailty by ID
 * *************************************************************************/
SpecialtyRoute.get('/:id', checkAccessToken, async (req, res) => {
    try {
        await specialty_model_1.SpecialtyInstance.findOne({
            where: {
                id: req.params.id
            }
        })
            .then((record) => {
            if (record) {
                res.json({ response: {
                        status: "success",
                        specialty: record
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
 *  Update specailty info by ID
 * *************************************************************************/
SpecialtyRoute.put('/update/:id', checkAccessToken, async (req, res) => {
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
    };
    try {
        await specialty_model_1.SpecialtyInstance.findOne({
            where: {
                id: req.params.id,
            }
        }).then((record) => {
            if (record) {
                specialty_model_1.SpecialtyInstance.update(specialtyData, {
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
 *  Edit specialty icon
 * *************************************************************************/
SpecialtyRoute.put('/update/specialty_icon/:id', checkAccessToken, upload.single('specialty_icon'), async (req, res) => {
    try {
        await specialty_model_1.SpecialtyInstance.update({
            specialty_icon: 'http://localhost:2222/specialty_icon/' + req.file?.originalname,
        }, {
            where: {
                id: req.params.id
            }
        }).then((record) => {
            if (record) {
                res.json({ response: {
                        status: 'success',
                        message: 'Profile pic updated successfully'
                    } });
            }
            else {
                res.json({ response: {
                        status: 'failed',
                        message: 'Record not found'
                    } });
            }
        })
            .catch(error => {
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
 *  Delete specailty info by ID
 * *************************************************************************/
SpecialtyRoute.delete('/delete/:id', checkAccessToken, async (req, res) => {
    try {
        await specialty_model_1.SpecialtyInstance.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(record => {
            if (record === 1) {
                res.json({ response: {
                        status: 'success',
                        message: 'Record Deleted Successfully..!'
                    } });
            }
            else {
                res.json({ response: {
                        status: 'failed',
                        message: 'Recode not found'
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
        res.json({
            status: 'failed',
            message: error
        });
    }
});
/***************************************************************************
 *  Add Doctor specailty
 * *************************************************************************/
SpecialtyRoute.post('/doctor/add_new', checkAccessToken, async (req, res) => {
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
    const specialty_id = crypto_1.default.randomUUID();
    let doctorSpecialtyData = {
        id: specialty_id,
        doctor_id: req.body.doctor_id,
        specialty_name: req.body.specialty_name,
        // created_at: today + ' ' + currentTime,
        // updated_at: today + ' ' + currentTime,
    };
    await doctorSpecialty_model_1.DoctorSpecialtyInstance.findOne({
        where: {
            doctor_id: req.body.doctor_id,
            specialty_name: req.body.specialty_name
        }
    }).then((specialty) => {
        if (!specialty) {
            doctorSpecialty_model_1.DoctorSpecialtyInstance.create(doctorSpecialtyData)
                .then((specialty) => {
                res.json({ response: {
                        status: "success",
                        message: 'Record has been added successfully..!'
                    } });
            })
                .catch((error) => {
                res.json({ response: {
                        status: "failed",
                        message: error
                    } });
            });
        }
        else {
            res.json({ response: {
                    status: "failed",
                    message: 'Record already exists'
                } });
        }
    })
        .catch((error) => {
        res.json({ response: {
                status: "failed",
                message: error
            } });
    });
});
module.exports = SpecialtyRoute;
