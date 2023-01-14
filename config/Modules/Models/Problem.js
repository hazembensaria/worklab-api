const mongoose=require('mongoose')
const UniqueValidator=require("mongoose-unique-validator");


const problem=mongoose.Schema({
    description:{type:String,require:true},
    name:{type:String,require:true,unique:true},
    difficulty:{type:String,require:true},
    category:{type:String,require:true},
    comments:{type:Array}
})
problem.plugin(UniqueValidator);
module.exports=mongoose.model("Problem",problem)