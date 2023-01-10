
const mongosse=require("mongoose");
const worklabSchema=mongosse.Schema({
   auther : String,
   autherName : String,
   name : String, 
   participants : Array,
   createdAt :  { type: Date, default: Date.now },
   chat : Array ,
   code : String,
   sharedCode : { type: Boolean, default: true },
})
module.exports=mongosse.model("worklaSchema",worklabSchema);