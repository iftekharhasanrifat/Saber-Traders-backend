import mongoose from "mongoose";

const truckSchema = mongoose.Schema(
    {
        truckNo:{
            type:String,
            required:true
        }
        
    },
    {
        timestamps:true
    }
)
export const Truck = mongoose.model('Truck', truckSchema);