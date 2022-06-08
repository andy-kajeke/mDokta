/**import dependencies */
import express, { Request, Response, NextFunction } from 'express';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import multer from 'multer';
import randomize from 'randomatic';
import cors from'cors';
import crypto from "crypto";
const UserRoute = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

/**import models */
import { UserInstance } from '../models/user.model';
import { DoctorSpecialtyInstance } from '../models/doctorSpecialty.model';
import { AppointmentInstance } from '../models/appointments.model';
const { checkAccessToken } = require('../auth/validationToken');

const salt = genSaltSync(10);
UserRoute.use(cors());

/**profile photo */
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./user_photos");
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
})

const upload = multer({ storage: storage })

/***************************************************************************
 *  Handle Create user account
 * *************************************************************************/
UserRoute.post('/create_account', (req: Request, res: Response) => {
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

    const user_id = crypto.randomUUID();

    let userData = {
        id: user_id,
        userType: req.body.userType,
        userStatus: 'Pending',
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        profilePhoto: 'http://localhost:2222/user_photo/holder.png',
        password: hashSync(req.body.password, salt),
        resetCode: '',
        created_at: today,
        updated_at: today + " " + currentTime
    }

    UserInstance.findOne(
        {
            where: {
                email: req.body.email,
                phoneNumber: req.body.phoneNumber
            }
        }
    ).then(user => {
        if(!user){
            UserInstance.create(userData)
            .then((user: any) => {
                res.json({response: {
                    status: 'success',
                    message: 'Welcome ' + user.firstName +' your account has been created successfully..!'
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
                message: 'Email or phone number already exists'
            }});
        }
    })
    .catch((error) => {
        res.json({response: {
            status: 'failed',
            message: error
        }});
    });
});

/***************************************************************************
 *  Handle user login
 * *************************************************************************/
UserRoute.post('/login', async(req: Request, res: Response) => {
    try {
        await UserInstance.findOne({
            where: {
                email: req.body.email
            }
        })
        .then((user: any) => {
            if (user) {
                if (compareSync(req.body.password, user.password)) {
                    if(user.userType === 'Admin'){
                        let token = jwt.sign(user.dataValues, process.env.SECURITY_KEY, {
                            expiresIn: "2h"
                        });
                        //res.send(token);
                        res.json({response: {
                            status: 'success',
                            is_user: true,
                            access_token: token,
                            token_expiry: '2hrs'
                        }});
                    }else{
                        let token = jwt.sign(user.dataValues, process.env.SECURITY_KEY, {
                            expiresIn: "365days"
                        });
                        //res.send(token);
                        res.json({response: {
                            status: 'success',
                            is_user: true,
                            access_token: token,
                            token_expiry: '365 days'
                        }});
                    }
                } else {
                    res.json({response: {
                        status: 'failed',
                        is_user: false,
                        message: 'Email or password is incorrect'
                    }});
                }
            } else {
                res.json({response: {
                    status: 'failed',
                    is_user: false,
                    message: 'User does not exist'
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
 *  Handle Change user password
 * *************************************************************************/
UserRoute.put('/change_password/:id', checkAccessToken, async(req, res) => {
    const old_password = req.body.old_password;
    const new_password = hashSync(req.body.new_password, salt);

    try {
        await UserInstance.findOne({
            where: {
                email: req.body.email 
            }
        })
        .then((user: any) => {
            if (user) {
                if (compareSync(old_password, user.password)) { 
    
                    UserInstance.update({
                        password: new_password
                    }, {
                        where: { email: req.body.email }
                    })
                    .then(() => {
                        res.json({response: {
                            status: 'success',
                            message: 'Password changed successfully'
                        }});
                    })
                    .catch(error => {
                        res.json({response: {
                            status: 'failed',
                            message: error
                        }});
                    });
    
                } else {
                    res.json({response: {
                        status: 'failed',
                        message: 'Current password is incorrect'
                    }});
                }
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
 *  Handle Forgot user password
 * *************************************************************************/
UserRoute.post('/forgot_password', async(req, res) => {
    var vaildationCode = randomize('0', 5);

    try {
        await UserInstance.findOne({
            where: {
                email: req.body.email
            }
        })
        .then((user: any) => {
            if (user) {
                //step 1
                let transporter = nodemailer.createTransport({
                    host: 'data-intell.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });
    
                //step 2  
                let mailOptions = {
                    from: process.env.EMAIL, 
                    to: user.email,
                    subject: 'Rest Account Password',
                    text: 'Hello ' + user.firstName + ', \nYour request to reset password has been acknowledged by mDokta. \nUse this verification code'+
                    ' '+ vaildationCode + ' to reset your password. \n\nThank you. Reguards'
                }
    
                //step 3
                transporter.sendMail(mailOptions, (err: any, data: any) => {
                    if(err){
                        console.log(err);
                        res.json({
                            message: err
                        })
                    }
                    else{
                        //console.log('Email sent..!!');
                        UserInstance.update({
                            resetCode: vaildationCode
                        }, {
                            where: {email: req.body.email}
                        })
                        .then(() => {
                            res.json({response: {
                                status: 'sucess',
                                message: 'Email sent'
                            }})
                        })
                    }
                })
            }else{
                res.json({response: {
                    status: 'failed',
                    message: 'Email doesnot exit'
                }})
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
 *  Handle Reset user password
 * *************************************************************************/
UserRoute.post('/reset_password', async(req: Request, res: Response) => {
    var verificationCode = req.body.verificationCode;
    var new_password = hashSync(req.body.new_password, salt);

    try {
        await UserInstance.findOne({
            where: {
                email: req.body.email,
                resetCode: verificationCode
            }
        })
        .then((user: any) => {
            if (user) {
                UserInstance.update({
                    password: new_password
                },{
                    where: {email: req.body.email}
                })
                .then(() => {
                    res.json({response: {
                        status: 'success',
                        message: 'Password has been reset successfully..!!'
                    }});
                })
            }else{
                res.json({response: {
                    status: 'failed',
                    message: 'Invalid verification code. Check your email and try again..'
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
 *  Get all users
 * *************************************************************************/
UserRoute.get('/', checkAccessToken, async(req: Request, res: Response) => {
    try {
        const records = await UserInstance.findAll();
        return res.json({response: {
            status: 'success',
            users: records
        }});
    } catch (error) {
        return res.json(error);
    }
});

/***************************************************************************
 *  Get user by userType and ID
 * *************************************************************************/
UserRoute.get('/:userType/:id', checkAccessToken, async(req: Request, res: Response) => {

    if(req.params.userType === 'Doctor' || req.params.userType === 'doctor'){
        try {
            const specialtyRecord: any = await DoctorSpecialtyInstance.findAll({ 
                attributes: ['id', 'specialty_name'],
                where: { doctor_id: req.params.id },
                order: [['specialty_name','ASC']]
            }); 

            const appointmentRecord: any = await AppointmentInstance.findAll({
                attributes: ['id', 'patient_id', 'specialty_id', 'appointmentDate', 'appointmentTime',
                'appointmentDescription', 'appointmentStatus', 'created_at', 'updated_at'], 
                where: { doctor_id: req.params.id },
                order: [['created_at','DESC']]
            });
    
            await UserInstance.findOne({
                where: {
                    id: req.params.id,
                    userType: req.params.userType
                }
            })
            .then((record: any) => {
                if(record){
                    res.json({response: {
                        status: 'success',
                        is_user: true,
                        user_info: {
                            userType: record.userType,
                            firstName: record.firstName,
                            lastName: record.lastName,
                            email: record.email,
                            phoneNumber: record.phoneNumber,
                            profilePhoto: record.profilePhoto,
                            specialties: specialtyRecord,
                            appointments: appointmentRecord
                        }
                    }})
                }
                else{
                    res.json({response: {
                        status: 'failed',
                        is_user: false,
                        message: 'Record not found'
                    }
                    });
                }
            })
        } catch (error) {
            return res.json({response: {
                status: 'failed',
                message: error
            }});
        }

    }
    else if(req.params.userType === 'Patient' || req.params.userType === 'patient'){
        try {
            const appointmentRecord: any = await AppointmentInstance.findAll({ 
                attributes: ['id', 'doctor_id', 'specialty_id', 'appointmentDate', 'appointmentTime',
                'appointmentDescription', 'appointmentStatus', 'created_at', 'updated_at'],
                where: { patient_id: req.params.id },
                order: [['created_at','DESC']]
            });
    
            await UserInstance.findOne({
                where: {
                    id: req.params.id,
                    userType: req.params.userType
                }
            })
            .then((record: any) => {
                if(record){
                    res.json({response: {
                        status: 'success',
                        is_user: true,
                        user_info: {
                            userType: record.userType,
                            firstName: record.firstName,
                            lastName: record.lastName,
                            email: record.email,
                            phoneNumber: record.phoneNumber,
                            profilePhoto: record.profilePhoto,
                            appointments: appointmentRecord
                        }
                    }})
                }
                else{
                    res.json({response: {
                        status: 'failed',
                        is_user: false,
                        message: 'Record not found'
                    }
                    });
                }
            })
        } catch (error) {
            return res.json({response: {
                status: 'failed',
                message: error
            }});
        }
    }
    else if(req.params.userType === 'Admin' || req.params.userType === 'admin'){
        try {
            await UserInstance.findOne({
                where: {
                    id: req.params.id,
                    userType: req.params.userType
                }
            })
            .then((record: any) => {
                if(record){
                    res.json({response: {
                        status: 'success',
                        is_user: true,
                        user_info: {
                            userType: record.userType,
                            firstName: record.firstName,
                            lastName: record.lastName,
                            email: record.email,
                            phoneNumber: record.phoneNumber,
                            profilePhoto: record.profilePhoto
                        }
                    }})
                }
                else{
                    res.json({response: {
                        status: 'failed',
                        is_user: false,
                        message: 'Record not found'
                    }});
                }
            })
        } catch (error) {
            return res.json({response: {
                status: 'failed',
                message: error
            }});
        }
    }
    else{
        res.json({response: {
            status: 'failed',
            is_user: false,
            message: 'Record not found'
        }});
    }
});

/***************************************************************************
 *  Handle Edit user info
 * *************************************************************************/
UserRoute.put('/update/info/:id', checkAccessToken, async(req: Request, res: Response) => {
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

    let userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        updated_at: today + ' ' + currentTime
    }
    try {
        await UserInstance.update(userData,{
            where:{
                id: req.params.id 
            }
        }).then((user: any) => {
            if(user){
                res.json({response: {
                    status: 'success',
                    message: 'Record uploaded successfully'
                }})
            }
            else{
                res.json({response: {
                    status: 'failed',
                    message: 'Record not found'
                }})
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
 *  Handle Edit user profile pic
 * *************************************************************************/
UserRoute.put('/update/profile_photo/:id', checkAccessToken, upload.single('profilePhoto'), async(req: Request, res: Response) => {
    try {
        await UserInstance.update({
            profilePhoto: 'http://localhost:2222/user_photo/' + req.file?.originalname,
        },{
            where:{
                id: req.params.id 
            }
        }).then((user: any) => {
            if(user){
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
 *  Handle Delete user account
 * *************************************************************************/
UserRoute.delete('/delete/:id', checkAccessToken, async(req: Request, res: Response) => {
    try {
        await UserInstance.destroy({
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

module.exports = UserRoute;
