import {Request,Response,NextFunction} from 'express'
import { AppError } from './AppError';

interface ResError extends Error {
    code?:number;
    errmsg?: any;
    path?: string;
    value?: any;
    isOperational?: boolean;
    status?:string;
    statusCode:number
}

const handleCastErrorDB = (err:ResError) =>{
    const message = `invalid ${err.path} : ${err.value}`
    return new AppError(message , 400)
}

const handleDublicateFieldsDB = (err:ResError)=>{
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `dublicate key value: ${value}`
    return new AppError(message,400)
}

const handleValidationErrorDB = (err:any)=>{
    const errors = Object.values(err.errors).map( (el:any) => el.message)
    const message = `invalid input : ${errors.join('. ')}`
    return new AppError(message,400)
}

const sendErrorDev = (err:ResError , res:Response)=>{
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    })
}

const sendErrorProd = (err:ResError , res:Response)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        })
    }else{
        res.status(500).json({
            status:'error',
            message:'something went wrong'
        })
    }
}

export function errorHandler(err:ResError,req:Request,res:Response,next:NextFunction){
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res);
    }else if(process.env.NODE_ENV ==='production'){

        let error = {...err}

        if(error.name === 'CastError') error = handleCastErrorDB(error)
        else if(error.code === 11000) error = handleDublicateFieldsDB(error)
        else if(error.name === 'ValidationError') error = handleValidationErrorDB(error)
        sendErrorProd(error,res);
    }
}