const express=require("express");
const compiler=require("../Controllers/compiler");
const route=express.Router();

route.post("/code",compiler.compile);

module.exports = route