const mongosse=require("mongoose");
const UniqueValidator=require("mongoose-unique-validator");
const userSchema=mongosse.Schema({
    email:{type:String ,require:true,unique:true},
    password:{type:String,require:true},
    name:{type:String,require:true},
    isVerified:Boolean,
    date: { type: Date, default: Date.now },
    role :{ type: String, default: 'user' },
   

})
userSchema.plugin(UniqueValidator);
module.exports=mongosse.model("User",userSchema);