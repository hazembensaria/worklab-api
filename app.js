
const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const  Connection  = require('./config/DBConnection');
const userRoutes=require("./config/Modules/Routes/user.js");
const compilerRoutes=require("./config/Modules/Routes/compiler.js");
const worklabRoutes=require("./config/Modules/Routes/worklab.js");
Connection();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

//----------------------------setHeaders------------------------------------------------
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin , X-Requested-With , Content-Type , Accept,authorization");//authorization to store the token
    res.header("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS");
    next();
})


app.get("/",(req ,res)=>{
    res.send('you are connected')
    console.log("helo")})

app.use("/user",userRoutes);
app.use("/worklab",worklabRoutes);
app.use("/compiler",compilerRoutes);
module.exports = app