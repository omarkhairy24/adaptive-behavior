import { Router } from "express";
import {addSkill,Uploader,editSkill,getSkill,deleteSkill,search,deleteManySkills } from '../controller/skills';

const skillRouter = Router();

skillRouter.get('/search',search);

skillRouter.get('/:skillId',getSkill);

skillRouter.post('/add-skill/:categoryId',Uploader,addSkill);

skillRouter.put('/edit-skill/:skillId',Uploader,editSkill);

skillRouter.delete('/delete-skill/:skillId',deleteSkill);

skillRouter.delete('/deleteManySkills',deleteManySkills);

export {skillRouter}