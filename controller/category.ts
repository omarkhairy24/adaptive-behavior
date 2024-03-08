import { Category } from '../model/category';
import { Request,Response,NextFunction } from 'express';

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
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};

export const addSubCategory = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const category = await Category.findById(req.params.categoryId);
        if (!category || category.isMain === false) {
            return res.status(404).json({
                status: 'fail',
                message: 'Category not found or not main category',
            });
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
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
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
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
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
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    } 
}