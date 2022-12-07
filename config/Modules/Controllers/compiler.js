

var request = require('request');



const compile = (req ,res)=>{
var program = {
    script : req.body.code,
    language: "nodejs",
    versionIndex: "0",
    clientId: "9c8d2b884fbe3f67d4515f33b2745f7",
    clientSecret:"8d34ed47abd78581c64e87ea0893aff6b05f6e38297dcd43ad170beb73ca007b"
};
request({
    url: 'https://api.jdoodle.com/v1/execute',
    method: "POST",
    json: program
},
function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
    res.status(response.statusCode).send(body)
    
})
}
module.exports={compile}