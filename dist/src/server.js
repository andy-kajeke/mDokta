"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
require('body-parser-xml')(body_parser_1.default);
const app = (0, express_1.default)();
app.use(body_parser_1.default.xml({
    limit: '1MB',
    xmlParseOptions: {
        normalize: true,
        normalizeTags: true,
        explicitArray: false // Only put nodes in array if >1
    }
}));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true })); 
app.listen(process.env.APP_PORT, () => {
    console.log('server is running at http://localhost:' + process.env.APP_PORT);
});
const userRouter = require('./routes/user.route');
const specialtyRouter = require('./routes/specialty.route');
const appointmentRouter = require('./routes/appointment.route');
app.get('/', (req, res) => res.send('Hello developer'));
app.use('/api/v1/users', userRouter);
app.use('/api/v1/specialties', specialtyRouter);
app.use('/api/v1/appointments', appointmentRouter);
app.use('/user_photo', express_1.default.static('user_photos/'));
app.use('/specialty_icon', express_1.default.static('specialty_photos/'));
