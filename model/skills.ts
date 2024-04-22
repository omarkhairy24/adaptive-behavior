import mongoose , {Document , ObjectId, mongo} from 'mongoose';
import { ICategory } from './category';

export interface ISkills extends Document{
    category:ICategory;
    name:string;
    description:string;
    imageUrl:string;
    videoUrl:string;
    sound:string
}

const skillSchema = new mongoose.Schema({
    category:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:[String],
    videoUrl:String,
    sound:String,
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

const Skills = mongoose.model<ISkills>('Skills',skillSchema);
export{ Skills }