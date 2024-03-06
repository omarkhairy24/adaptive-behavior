import { Router } from "express";
import { createCategory ,addSubCategory ,getCategory } from "../controller/category";

const categoryRouter = Router();

categoryRouter.get('/:categoryId',getCategory);
categoryRouter.post('/add-category',createCategory);
categoryRouter.patch('/add-subCategory/:categoryId',addSubCategory);

export {categoryRouter}