import express from "express";
import * as dotenv from 'dotenv';
import { connect } from "./util/connect";
import { categoryRouter } from "./routes/category";
import { skillRouter } from "./routes/skills";
import morgan from "morgan";
import { AppError } from './util/AppError';
import { errorHandler } from './util/errorHandler';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/category',categoryRouter);
app.use('/api/skills',skillRouter);


app.all('*' ,(req,res,next)=>{
    next(new AppError(`cant find ${req.originalUrl}` , 404));
})

app.use(errorHandler);

app.listen(3000 , async()=>{
    await connect();
});