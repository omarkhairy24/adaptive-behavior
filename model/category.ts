import mongoose , {Document , ObjectId, mongo} from 'mongoose';

export interface ICategory extends Document{
    name:string;
    subCategories:Array<ICategory>;
    isMain:boolean;
}


const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    subCategories:[{
        type:mongoose.Schema.ObjectId,
        ref:'Category'
    }],
    isMain:Boolean
});

categorySchema.pre<ICategory>(/^find/,function(next){
    this.populate('subCategories');
    next();
});

const Category = mongoose.model<ICategory>('Category',categorySchema);


export {Category}