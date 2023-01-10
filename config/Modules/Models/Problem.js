const mongoose=require('mongoose')

const problem=mongoose.Schema({
    description:{type:String,require:true},
    name:{type:String,require:true,unique:true},
    difficulty:{type:String,require:true}
})

module.exports=mongoose.model("Problem",problem)