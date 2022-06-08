import { Request, Response, NextFunction } from "express";
const { verify } = require('jsonwebtoken');

module.exports = {
    checkAccessToken: (req: Request, res: Response, next: NextFunction) => {
        let token = req.get('authorization');
        if (token) {
            token = token.slice(7);
            verify(token, process.env.SECURITY_KEY, (err: any, decoded: any) => {
                if (err) {
                    res.json({response: {
                        status: 'failed',
                        message: 'Invalid access_token'
                    }});
                } else {
                    next();
                }
            });
        } else {
            res.json({response: {
                status: 'failed',
                message: 'Access denied! unauthorized user'
            }});
        }
    }
}