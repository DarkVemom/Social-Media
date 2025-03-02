import mongoose from "mongoose";
import crypto from "crypto";
import CryptoJS from "crypto-js";

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String ,
            required : true,
        },
        username :{
            type: String,
            required:true,
            unique : true,
            
        },
        email:{
            type:String,
            required:true,
            unique : true,

        },
       password :{
        type: String,
        required : true,
        minlength: 6,
       },
       profilePic :{
        type : String,
        default: "",

       },
       followers:{
        type : [String],
        default:[],
       },
       following :{
        type : [String],
        default:[],
       },
       bio:{
        type:String,
        default: "Hey there i am using threads !!!!"
       },
       isFrozen: {
        type: Boolean,
        default: false,
    },
    isFA:{
        type:Boolean,
        default:false,
    },
    blockedUser:{
        type : [String],
        default:[],
       },
    blockedByUser:{
        type : [String],
        default:[],
       },
       resetPasswordToken : String,
       resetPasswordExpireAt : Date,
       isTwoFatoor :String,
    },
    { timestamps : true}
);


userSchema.methods.generateVerificationCode = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpireAt = Date.now() + 15 * 60 * 1000;
    return resetToken;
}
userSchema.methods.generateVerificationCodes = function(){
    const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
    this.isTwoFatoor = resetToken.split('').map(digit => (parseInt(digit) + 3) % 10).join('');
    return resetToken;
}


const User = mongoose.model("User", userSchema);

export default User;