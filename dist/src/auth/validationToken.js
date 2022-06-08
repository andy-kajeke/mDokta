"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { verify } = require('jsonwebtoken');
module.exports = {
    checkAccessToken: (req, res, next) => {
        let token = req.get('authorization');
        if (token) {
            token = token.slice(7);
            verify(token, process.env.SECURITY_KEY, (err, decoded) => {
                if (err) {
                    res.json({ response: {
                            status: 'failed',
                            message: 'Invalid access_token'
                        } });
                }
                else {
                    next();
                }
            });
        }
        else {
            res.json({ response: {
                    status: 'failed',
                    message: 'Access denied! unauthorized user'
                } });
        }
    }
};
