const express=require("express");


const user=require("../Controllers/user");
// import {loginUser ,signUpUser , verifiy , verified} from "../Controllers/user"

const route=express.Router();




route.post("/login",user.loginUser);

route.post("/signUp",user.signUpUser);   

route.post("/reset",user.resetPassword);

route.post("/setNewPass",user.setNewpass)

route.get("/verified",user.verified);

route.get("/verify/:userId/:uniqueString",user.verifiy);



module.exports = route
