import express from "express";
import dotenv from 'dotenv';
import { connect } from "./util/connect";
import { categoryRouter } from "./routes/category";

dotenv.config();

const app = express();
app.use(express.json())

app.use('/api/category',categoryRouter);

app.listen(3000 , async()=>{
    await connect();
});