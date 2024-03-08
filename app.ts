import express from "express";
import * as dotenv from 'dotenv';
import { connect } from "./util/connect";
import { categoryRouter } from "./routes/category";
import { skillRouter } from "./routes/skills";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/category',categoryRouter);
app.use('/api/skills',skillRouter);

app.listen(3000 , async()=>{
    await connect();
});