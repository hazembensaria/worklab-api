const express=require("express");

const loginUser= require('../Controllers/user');
const signUpUser=require('../Controllers/user');
const verified=require("../Controllers/user");
const verify=require("../Controllers/user");


const route=express.Route();


//-------------------------Login--------------------------------Done

route.post("/login",loginUser);

route.post("/signUp",signUpUser);   

route.get("/verified",);

route.get("/verify/:userId/:uniqueString",);




//-------------------------Register --------------------------------ToDo