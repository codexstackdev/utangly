import mongoose from "mongoose";



const historySchema = new mongoose.Schema({
    payBy: {type:String, required: true},
    amountPaid: {type:Number, required: true},
    issuedBy: {type: mongoose.Schema.Types.ObjectId, required: true},
}, {timestamps: true});


const historyModel = mongoose.models.historys || mongoose.model("historys", historySchema);


export default historyModel;