import mongoose from "mongoose";

export function connect(){
    const mongoUrl = process.env.MONGO_URL || '' ;
    return mongoose.connect(mongoUrl).then(()=>{
        console.log('connected to DB');
        
    }).catch(e =>{
        console.log(`something went wrong ${e}`);
    })
}