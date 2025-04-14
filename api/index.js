import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './Routes/user.route.js'
import authRouter from './Routes/auth.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import listingRouter from './Routes/listing.route.js'

dotenv.config()


mongoose 
  .connect(process.env.MONGO)
  .then(()=>{
    console.log("Connected to MONGODB");
    
  })
  .catch((err)=>{
    console.log(err);
    
  })
  console.log('ENV:', process.env.NODE_ENV);

const app = express();

app.use(cookieParser())

 app.use(cors({
   origin: 'http://localhost:5173', // Adjust if your frontend runs on a different port
   credentials: true, // Allow cookies to be sent
}));

//app.options('*', cors()); // Let all preflight requests pass


app.use(express.json());



app.listen(3000, () => {
    console.log('Server is running on port 3000 !!!');
    }
);  

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);

app.use((err,req,res ,next) => {
  const statuscode = err.statuscode||500;
  const message = err.message || 'Internal Servar Error';
  return res.status(statuscode).json({
    success: false ,
    statuscode,
    message,
  })
})
