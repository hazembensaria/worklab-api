const express=require('express');
const problem=require('../Controllers/problem.controller');
const route=express.Router();

route.post("/addProblem",problem.addProblem);
route.get('/getProblems',problem.getProblems);
route.get('/getProblem/:id',problem.getProblem)



module.exports=route ;