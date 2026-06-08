import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    loanAmount:{
        type:Number,
        required:true
    },
    loantenure:{
        type:Number,
        required:true
    },
    anualincome:{
        type:Number,
        required:true
    },
    monthlyincome:{
        type:Number,
        required:true
    },
    creditscore:{
        type:Number,
        required:true
    },
    loanpurpose:{
        type:String,
        required:true
    },
    emplymentstatus:{
        type:String,
        required:true
    },
    workexperience:{
        type:Number,
        required:true
    },
    existingloans:{
        type:Number,
        required:true,
        default:0
    },
    status:{
        type:String,
        enum:["pending","approved","decline"],
        default:"pending"
    }
},{timestamps:true}
)

export const loan = mongoose.model("loan",loanSchema

)