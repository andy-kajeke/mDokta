import 'dotenv/config';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
require('body-parser-xml')(bodyParser);

const app = express();

app.use(bodyParser.xml({
    limit: '1MB',   // Reject payload bigger than 1 MB
    xmlParseOptions: {
      normalize: true,     // Trim whitespace inside text nodes
      normalizeTags: true, // Transform tags to lowercase
      explicitArray: false // Only put nodes in array if >1
    }
})); 

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.APP_PORT, () => {
  console.log('server is running at http://localhost:' + process.env.APP_PORT);
});

const userRouter = require('./routes/user.route');
const specialtyRouter = require('./routes/specialty.route')
const appointmentRouter = require('./routes/appointment.route')

app.get('/', (req: Request ,res: Response) => res.send('Hello developer'));
app.use('/api/v1/users', userRouter);
app.use('/api/v1/specialties', specialtyRouter);
app.use('/api/v1/appointments', appointmentRouter);
app.use('/user_photo', express.static('user_photos/'));
app.use('/specialty_icon', express.static('specialty_photos/'));