import { Router } from "express";
import { createCategory ,addSubCategory ,getCategory,getMainCategories } from "../controller/category";

const categoryRouter = Router();

categoryRouter.get('/main-categories',getMainCategories)
categoryRouter.get('/:categoryId',getCategory);
categoryRouter.post('/add-category',createCategory);
categoryRouter.patch('/add-subCategory/:categoryId',addSubCategory);

export {categoryRouter}