import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    fullName: {type:String, required: true},
    email: {type:String, required: true},
    password: {type:String, required: true},
    items: [{type: mongoose.Schema.Types.ObjectId, default: []}]
}, {timestamps: true});


const userModel = mongoose.models.users || mongoose.model("users", userSchema);

export default userModel;