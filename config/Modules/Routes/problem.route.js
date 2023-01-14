const express=require('express');
const problem=require('../Controllers/problem.controller');
const route=express.Router();
const checkAuth = require("../../../Middlewares/checkAuth")


route.post("/addProblem",checkAuth,problem.addProblem);
route.get('/getProblems',problem.getProblems);
route.get('/getProblem/:id',problem.getProblem)
route.put('/addComment',checkAuth,problem.addcomment)



module.exports=route ;