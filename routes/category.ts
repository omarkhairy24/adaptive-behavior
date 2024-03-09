import { Router } from "express";
import { createCategory ,addSubCategory ,getCategory,getMainCategories,deleteCategory } from "../controller/category";

const categoryRouter = Router();

categoryRouter.get('/main-categories',getMainCategories)
categoryRouter.get('/:categoryId',getCategory);
categoryRouter.post('/add-category',createCategory);
categoryRouter.patch('/add-subCategory/:categoryId',addSubCategory);
categoryRouter.delete('/delete-category',deleteCategory);

export {categoryRouter}