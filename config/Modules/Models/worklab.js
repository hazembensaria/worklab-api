
const mongosse=require("mongoose");
const worklabSchema=mongosse.Schema({
   auther : String,
   autherName : String,
   name : String, 
   participants : Array,
   createdAt :  { type: Date, default: Date.now },


})
module.exports=mongosse.model("worklaSchema",worklabSchema);