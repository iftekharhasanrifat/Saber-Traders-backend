import express, { request } from 'express';
import { PORT , mongoDBURL} from './config.js';
import cors from 'cors';
import mongoose from 'mongoose';
import traderRouter from './routes/tradersRoute.js';

import truckRouter from './routes/truckRoute.js';
const app = express();
app.use(express.json());

app.use(cors());

app.use('/traders', traderRouter)
app.use('/trucks', truckRouter)

mongoose.connect(mongoDBURL)
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})
.catch((error) => {
    console.log('Error:', error);
});