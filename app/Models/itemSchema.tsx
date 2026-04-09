import mongoose from "mongoose";


const itemSchema = new mongoose.Schema({
    itemName: {type:String, required: true},
    price: {type:Number, required: true},
    quantity: {type:Number, default: 0},
}, {timestamps: true});

const itemModel = mongoose.models.items || mongoose.model("items", itemSchema);

export default itemModel;