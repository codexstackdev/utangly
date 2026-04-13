import mongoose from "mongoose";



const debtorSchema = new mongoose.Schema({
    fullName: {type:String, required: true},
    totalDebt: {type:Number, default: 0},
    status: {type:String, enum: ["paid", "not paid"], default: "not paid"},
    items: [{
        itemName: {type:String, required: true},
        quantity: {type: Number, required: true},
        price: {type:Number, required: true},
        _id: {type:String, required: true},
        createdAt: {type:String, required: true}
    }],
    history: [{type:mongoose.Schema.Types.ObjectId, default: [], ref: "historys"}]
}, {timestamps: true});


const debtorModel = mongoose.models.debtors || mongoose.model("debtors", debtorSchema);

export default debtorModel;