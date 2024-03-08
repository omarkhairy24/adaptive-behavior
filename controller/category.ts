import { Category } from '../model/category';
import { Request,Response,NextFunction } from 'express';
import { AppError } from '../util/AppError';

export const createCategory = async (req:Request,res:Response,next:NextFunction)=> {
    try {
        const category = await Category.create({
            name:req.query.name,
            isMain:true
        })

        res.status(200).json({
            status:'success',
            category
        })

    } catch (error) {
        next(error)
    }
};

export const addSubCategory = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const category = await Category.findById(req.params.categoryId);
        if (!category || category.isMain === false) {
            return next(new AppError('Category not found or not main category',400));
        }
        
        const subCategory = await Category.create({
            name:req.query.name,
            isMain:false
        })

        category?.subCategories.push(subCategory._id);
        await category?.save();

        res.status(201).json({
            status:'success',
            category
        })

    } catch (error) {
        next(error);
    }
};

export const getCategory = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const category = await Category.findById(req.params.categoryId).populate('skills');
        res.status(200).json({
            status:'success',
            category
        })

    } catch (error) {
        next(error);
    }
}

export const getMainCategories = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const category = await Category.find({isMain:true}).populate('skills');
        res.status(200).json({
            status:'success',
            category
        })

    } catch (error) {
        next(error);
    } 
}