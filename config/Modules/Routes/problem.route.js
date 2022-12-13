const express=require('express');
const problem=require('../Controllers/problem.controller');
const route=express.Router();

route.post("/addProblem",problem.addProblem);



module.exports=route ;