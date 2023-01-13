const express=require("express");
const user=require("../Controllers/user");
const checkAuth = require("../../../Middlewares/checkAuth")
const route=express.Router();




route.post("/login",user.loginUser);

route.post("/signUp",user.signUpUser);   

route.post("/reset",user.resetPassword);

route.post("/setNewPass",user.setNewpass);

route.put("/editProfile",checkAuth,user.updateUser)

route.get("/",checkAuth , user.getCurrentUser);

route.get("/verified",user.verified);

route.get("/verify/:userId/:uniqueString",user.verifiy);



module.exports = route
