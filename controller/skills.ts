import multer from 'multer';
import {Skills} from '../model/skills';
import { Category } from '../model/category';
import { Request,Response,NextFunction } from 'express';
import {v2 as cloudinary} from 'cloudinary';
import { Readable } from 'stream';
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

    if (!files) {
        throw new Error('No files uploaded');
    }

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
            return res.status(404).json({
                status: 'fail',
                message: 'Category not found',
            });
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
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
}

export const editSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const skillId = req.params.skillId;
        let skill = await Skills.findById(skillId);

        if (!skill) {
            return res.status(404).json({
                status: 'fail',
                message: 'Skill not found',
            });
        }

        const { imageUrls, soundFile } = await uploadFiles(req.files as Record<string, Express.Multer.File[]>);

        let updateData: any = {
            name: req.body.name,
            description: req.body.description,
            videoUrl: req.body.videoUrl,
        };

        if (imageUrls.length > 0) {
            updateData.imageUrl = imageUrls;
        }

        if (soundFile) {
            updateData.sound = soundFile;
        }

        skill = await Skills.findByIdAndUpdate(skillId,updateData,{ new:true })

        res.status(200).json({
            status: 'success',
            skill,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
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
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
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
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
}