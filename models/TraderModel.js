import mongoose from "mongoose";

const traderSchema = mongoose.Schema(
    {
        truckNo:{
            type:String,
            required:true
        },
        date:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        quantityOfCementBagRod:{
            type:Number,
            required:false
        },
        priceRate:{
            type:Number,
            required:false
        },
        taka:{
            type:Number,
            required:true
        },
        driverSalary:{
            type:Number,
            required:true
        },
        fuelExpense:{
            type:Number,
            required:false
        },
        labourGratuity:{
            type:Number,
            required:false
        },
        toll:{
            type:Number,
            required:false
        },
        transportCost:{
            type:Number,
            required:false
        },
        transportCostDescription: {  // New Field Added
            type: String,
            required: false
        },
        remainingTaka:{
            type:Number,
            required:true
        }
        
    },
    {
        timestamps:true
    }
)
export const Trader = mongoose.model('Trader', traderSchema);