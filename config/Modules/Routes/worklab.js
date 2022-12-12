


const express=require("express");
const worklab=require("../Controllers/worklab");
const checkAuth = require("../../../Middlewares/checkAuth")
const route=express.Router();

route.post("/create",checkAuth,worklab.create);
route.post("/join",checkAuth,worklab.join);
route.post("/getWorklab",checkAuth,worklab.getWorklab);
route.post("/addParticipant",checkAuth,worklab.addParticipant);

module.exports = route