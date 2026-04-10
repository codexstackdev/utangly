import mongoose from "mongoose";



const debtorSchema = new mongoose.Schema({
    fullName: {type:String, required: true},
    totalDebt: {type:Number, default: 0},
    items: [{
        itemName: {type:String, required: true},
        quantity: {type: Number, required: true},
        price: {type:Number, required: true},
        _id: {type:String, required: true},
        createdAt: {type:String, required: true}
    }],
}, {timestamps: true});


const debtorModel = mongoose.models.debtors || mongoose.model("debtors", debtorSchema);

export default debtorModel;