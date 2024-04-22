import multer from 'multer';
import {Skills} from '../model/skills';
import { Category } from '../model/category';
import { Request,Response,NextFunction } from 'express';
import {v2 as cloudinary} from 'cloudinary';
import { Readable } from 'stream';
import {AppError} from '../util/AppError';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.cloudApiKey,
    api_secret: process.env.cloudApiSercret,
});

const multerStorage = multer.memoryStorage();
const upload = multer({storage:multerStorage});
export const Uploader = upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'sound', maxCount: 1 }
]);

const uploadFiles = async (files: Record<string, Express.Multer.File[]>) => {
    const imageUrls: string[] = [];
    let soundFile;

    // if (!files) {
    //     throw new Error('No files uploaded');
    // }

    for (const fieldName in files) {
        const fieldFiles = files[fieldName];

        for (const file of fieldFiles) {
            const readableStream = new Readable();
            readableStream.push(file.buffer);
            readableStream.push(null);

            const newPath = await new Promise<string>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'auto',
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            //@ts-ignore
                            resolve(result.secure_url);
                        }
                    }
                );
                readableStream.pipe(stream);
            });

            if (fieldName === 'images' && file.mimetype.startsWith('image')) {
                imageUrls.push(newPath);
            } else if (fieldName === 'sound' && file.mimetype.startsWith('audio')) {
                soundFile = newPath;
            }
        }
    }

    return { imageUrls, soundFile };
};


export const addSkill = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        
        const category = await Category.findById(req.params.categoryId);
        if(!category){
            return next(new AppError('category not found',404))
        }

        const { imageUrls, soundFile } = await uploadFiles(req.files as Record<string, Express.Multer.File[]>);

        const skill = await Skills.create({
            category:category._id,
            name:req.body.name,
            description:req.body.description,
            imageUrl:imageUrls,
            videoUrl:req.body.videoUrl,
            sound:soundFile
        });

        res.status(200).json({
            status:'success',
            skill
        });

    } catch (error) {
        next(error);
    }
}

export const editSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const skillId = req.params.skillId;
        let skill = await Skills.findById(skillId);

        if (!skill) {
            return next(new AppError('skill not found',404));
        }

        const { imageUrls, soundFile } = await uploadFiles(req.files as Record<string, Express.Multer.File[]>);

        let updateData: any = {
            name: req.body.name,
            description: req.body.description,
            videoUrl: req.body.videoUrl,
        };

        const oldImageUrls: string[] = req.body.oldImages || [];
        let allImageUrls = [...imageUrls];
        if(Array.isArray(oldImageUrls)){
            allImageUrls.push(...oldImageUrls)
        }
        else{
            allImageUrls.push(oldImageUrls)
        }
        updateData.imageUrl = allImageUrls;

        if (soundFile) {
            updateData.sound = soundFile;
        }
        else if(req.body.oldSound){
            updateData.sound = skill.sound
        }
        else{
            updateData.sound = null;
        }

        skill = await Skills.findByIdAndUpdate(skillId,updateData,{ new:true })

        res.status(200).json({
            status: 'success',
            skill,
        });
    } catch (error) {
        next(error)
    }
};

export const getSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const skill = await Skills.findById(req.params.skillId);
        res.status(200).json({
            status:'success',
            skill
        })

    } catch (error) {
        next(error);
    }
}

export const deleteSkill = async (req: Request, res: Response, next: NextFunction) =>{
    await Skills.findByIdAndDelete(req.params.skillId);
    res.status(200).json({
        status:'success',
        message:'skill deleted successfully'
    })
}

export function generateSearchFields(fields: string[], searchQ: string) {
    return fields.flatMap(field => [
        { [field]: { $regex: searchQ, $options: "i" } },
        { [field]: { $regex: searchQ, $options: "xi" } },
        { [field]: { $regex: searchQ, $options: "x" } }
    ]);
}

export const search = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        let search = req.query.search as string;
        let result = generateSearchFields(['name','description'],search);
        let searchResult = await Skills.find({$or:result});
        res.status(200).json({
            status:'success',
            result:searchResult
        })
    } catch (error) {
        next(error);
    }
}

export const deleteManySkills = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const skillIdS = req.query.skillIds;
        
        if (!Array.isArray(skillIdS)) {
            return res.status(400).json({
                status: 'fail',
                message: 'skillIds should be an array'
            });
        }

        await Skills.deleteMany({ _id: { $in: skillIdS } });

        return res.status(200).json({
            status: 'success',
            message: 'skills deleted successfully'
        });
    } catch (error) {
        return next(error);
    }
};