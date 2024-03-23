import { Router } from "express";
import { createCategory ,addSubCategory ,getCategory,getMainCategories,deleteCategory,editCategory,deleteManyCategories } from "../controller/category";

const categoryRouter = Router();

categoryRouter.get('/main-categories',getMainCategories)
categoryRouter.get('/:categoryId',getCategory);
categoryRouter.post('/add-category',createCategory);
categoryRouter.patch('/add-subCategory/:categoryId',addSubCategory);
categoryRouter.patch('/edit-category/:categoryId',editCategory);
categoryRouter.delete('/delete-category',deleteCategory);
categoryRouter.delete('/deleteManyCategories',deleteManyCategories);

export {categoryRouter}