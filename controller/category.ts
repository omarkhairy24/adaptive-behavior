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

        let category = await Category.findById(req.params.categoryId);
        if (!category || category.isMain === false) {
            return next(new AppError('Category not found or not main category',400));
        }

        const subCategory = await Category.create({
            name:req.query.name,
            isMain:false
        })

        category = await Category.findByIdAndUpdate(req.params.categoryId, {
            $addToSet: { subCategories: subCategory._id }
        }, {
            new: true
        });

        res.status(201).json({
            status:'success',
            category
        });

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

export const editCategory = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        let category = await Category.findById(req.params.categoryId)
        if(!category){
            return next(new AppError('category not found',404))
        }

        category = await Category.findByIdAndUpdate(req.params.categoryId,req.query,{
            new:true,
            runValidators:true
        });
        res.status(201).json({
            status:'success',
            category
        })

    } catch (error) {
        next(error)
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

export const deleteCategory = async(req:Request,res:Response,next:NextFunction)=>{
    await Category.findByIdAndDelete(req.query.categoryId);
    res.status(200).json({
        status:'success',
        message :'category deleted successfully'
    })
};

export const deleteManyCategories = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const categoryIds = req.query.categoryIds;
        
        if (!Array.isArray(categoryIds)) {
            return res.status(400).json({
                status: 'fail',
                message: 'categoryIds should be an array'
            });
        }

        await Category.deleteMany({ _id: { $in: categoryIds } });

        return res.status(200).json({
            status: 'success',
            message: 'Categories deleted successfully'
        });
    } catch (error) {
        return next(error);
    }
};