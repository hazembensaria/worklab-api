const express=require("express");


const user=require("../Controllers/user");
// import {loginUser ,signUpUser , verifiy , verified} from "../Controllers/user"

const route=express.Router();


//-------------------------Login--------------------------------Done

route.post("/login",user.loginUser);

route.post("/signUp",user.signUpUser);   

// route.get("/verified",user.verified);

route.get("/verify/:userId/:uniqueString",user.verifiy);



module.exports = route
//-------------------------Register --------------------------------ToDo