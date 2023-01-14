
const bcrypt=require("bcrypt");
const User=require("../Models/user");
const jwt=require("jsonwebtoken");
const path = require("path")
const userVerification=require("../Models/UserVerification")
require("dotenv").config();
const nodemailer=require("nodemailer");
const {v4:uuidv4}=require("uuid");


//node mailer stuff
let transporter=nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:process.env.AUTH_EMAIL,
            pass:process.env.AUTH_PASS
    }
});
 transporter.verify((error,sucess)=>{
     if (error)
         console.log("error:"+error)
     else console.log("ready for message"+sucess);
 })



//------------------------------- login controllor ----------------

const loginUser=async(req,res,next)=>{

    let fetchedUser;
   const user =await User.findOne({email:req.body.email})
   console.log(user)
   fetchedUser=user;
   if(! user){
    console.log('user not found !!')
    return res.status(404).json({message:"user not found"});
   }
    const compare = await bcrypt.compare(req.body.password,fetchedUser.password);
    console.log(compare);

    if(!compare){
         console.log('password faild !!');
        return res.status(404).json({message:"faild to connect here!"});
    }
    const token=jwt.sign({email:fetchedUser.email,userId:fetchedUser._id},
                                  "secret_this_should_be_longer",
                                     {expiresIn: "24h"});
    console.log(token)
    return res.status(201).json({token, id : fetchedUser._id,  role:fetchedUser.role , name : fetchedUser.name,email:fetchedUser.email});  

}




//-----------------------Register Controller-------------------------------

const signUpUser=(req,res,next)=>{
    // console.log('function from sign up')
   
    
    
    bcrypt.hash(req.body.password,10).then(hash=>{
        const user=new User({
            email:req.body.email,
            password:hash,
            name:req.body.name,
            isVerified:false,
        }).save().then(result=>{
            const cuurentUrl = "http://localhost:4000/";
            const subject = "verify your email";
            const html = `<p>verify your email to complete the signup and login into your account</p>
    <p>this link <b>expire in 6 hours</b></p><p>press<a href=${cuurentUrl + "user/verify/" + result._id +"/"+ result._id}>here</a> to proceed</p>`;
            sendVerificationEmail({_id:result._id+"",email:result.email},res,{subject ,html});
        }).catch(error=>{
        console.log(error)
        {res.status(400).json({message:"oups we can't add user somthing went wrong!"})}})
    })
}


//------------------------sendMail Verification------------------------------------------------------------------

const  sendVerificationEmail=({_id,email},res , {subject , html})=> {
   
    const uniqueString =  _id;//maybe worng na7i el faza eli 3malha hoia nta3 el uuid deja mat9al9ch blch biha
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: subject,
        html: html
    }

    const salRounds = 10;
    bcrypt
        .hash(uniqueString, salRounds)
        .then((hashedString) => {
            const newVerification = new userVerification({
                userId: _id,
                uniqueString: hashedString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21000000
            })
                console.log(newVerification)
            newVerification
                .save()
                .then(() => {
                        transporter
                            .sendMail(mailOptions)
                            .then(() => {
                                res.json({
                                    status: "pending",
                                    message: "success email verification "
                                })

                            })
                            .catch(error => {
                                console.log(error)
                                res.json({
                                    status: "failed",
                                    message: "something went wrong while transport data "
                                })
                            })})
                            .catch(error => {
                                console.log(error)
                                res.json({
                                    status: "failed",
                                    message: "something went wrong while saving user verification "
                                })
                            })
                    }
                ).catch(error => {
                console.log(error)
                res.json({
                    status: "failed",
                    message: "something went wrong while hashing "
                })
            })
        ;
}
// -------------------------------reset password --------------------------
const resetPassword = (req,res)=>{
    let {email} = req.body;
    User.findOne({email}).then(user=>{
        if(!user){
            return res.status(404).send("user not found");
        }

        const cuurentUrl = "http://localhost:4200/";
            const subject = "verify your email";
            const html = `<p>you forgot your password !</p>
    <p>this link <b>expire in 6 hours</b></p><p>press<a href=${cuurentUrl + "user/reset/"+user._id}>here</a> to reset your password </p>`;
    sendResetPasswordMail(email,{subject,html},res);
        
    })
}

//-----------------------------------Set New Pass ------------------------

    const setNewpass=(req,res)=>{
        console.log("setNewpss");
        let {password,id}=req.body;
        User.findOne({_id:id}).then(user=>{
            if(!user){
                console.log("user not found !");
                res.status(404).json({message:"user not found"})
            }

            bcrypt.hash(password,10).then(hash=>{
                console.log("user hashed");
                User.updateOne({_id:user._id},{password:hash})
                .then(resp=>{

                    console.log("password reset sucessfuly");
                    res.status(200).json({
                        message:"password reset sucessfuly !"
                    })
                }).catch (err=>{
                        res.status(400).json({
                            message:"error while updating user's password"
                        })
                })

            })

            
        }).catch(err=>{
            res.status(400).json({
                message:err
            })
        })
    }


//--------------------------------verifiy-------------------------------

const verifiy= (req,res)=>{
    let {userId,uniqueString}=req.params;

    userVerification.find({userId})
        .then((result)=>{
            if(result.length>0){
                console.log("res1:"+result[0])
                const {expiresAt}=result[0];
                const hashedUniqueString=result[0].uniqueString;
                if (expiresAt<Date.now()){
                    userVerification.deleteOne({userId})
                        .then(resulta=>{
                            User.deleteOne({_id:userId})
                                .then(()=>{
                                    let message= "user deleted please sign up again  ";
                                    res.redirect(`user/verified?error=true&message=${message}`)
                                })
                                .catch(error=>{
                                console.log("error:can't delet user  "+error);
                                    let message= "clearing user with unique string failed ";
                                    res.redirect(`user/verified?error=true&message=${message}`)
                            })
                        })
                        .catch((error)=>{
                            console.log(error);
                            let message= "An error occured while clearing expired user verification record ";
                            res.redirect(`user/verified?error=true&message=${message}`)
                        })

                }else {
                    bcrypt.compare(uniqueString,hashedUniqueString)
                        .then((result)=>{
                            console.log("res2:"+result)
                            if (result){
                                User.updateOne({_id:userId},{isVerified:true})
                                    .then(()=>{
                                        userVerification.deleteOne({userId}).then(userverif=>{
                                            console.log("updated3");
                                            res.sendFile(path.join(__dirname,"../views/verified.html"));
                                            //res.redirect(`/api/user/verified?id=${userId}`)
                                            console.log("is that her the fucking errror!");
                                        }).catch(error=>{
                                            console.log("there is a problem while deleting verifuser !")
                                        })
                                      
                                    })
                                    .catch(error=>{
                                        let message= "an error occured while updating user to verified";
                                        res.redirect(`user/verified?error=true&message=${message}`)
                                    })
                            }else{
                                let message= "invalid validation of unique string . check your inbox";
                                res.redirect(`user/verified?error=true&message=${message}`)
                            }
                        })
                        .catch(error=>{
                            let message= "an error occured while comparing the unique string";
                            res.redirect(`user/verified?error=true&message=${message}`)
                        })
                }
            }else {
                let message= "account doesn't exist or has been verified already";
                res.redirect(`user/verified?error=true&message=${message}`)
            }
        })
        .catch(error=>{
            console.log(error)
            let message= "An error occured while checking for existing user";
            res.redirect(`user/verified?error=true&message=${message}`)

        });
}




//--------------------------verified-------------------------------
const verified=(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/verified.html"))// the file path of the code html that will shown to the user to verify her account using email
}


//-----------------------send Reset Password Mail ------------------


const sendResetPasswordMail = (email,{subject,html},res)=>{

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: subject,
        html: html
    }

    transporter.sendMail(mailOptions)
                            .then(() => {
                                res.json({
                                    status: "pending",
                                    message: "Reset mail sent secessfuly "
                                })

                            })
                            .catch(error => {
                                console.log(error)
                                res.json({
                                    status: "failed",
                                    message: "something went wrong while transport data "
                                })
                            })

}

// ----------------------find the current user and get his credentials--------------------------------------
 const getCurrentUser =  (req ,res)=>{
    const id = req.userData.userId;
   
    User.findById(id , {name : 1,email:1}).then(resul=>{
       
        res.json(resul)
    }, err=>{
        console.log(err)
    })
}


//---------------------update user ----------------------------

const updateUser =(req,res)=>{
    const userId=req.userData.userId;
    const fieldsToUpdate=req.body;
    console.log("fieldstoUpdate"+fieldsToUpdate.name);
    User.findOneAndUpdate({_id:userId},fieldsToUpdate).then(user=>{
        console.log("updated from updateUser");
        res.status(201).json({success:"updated",user})
    }).catch(err=>{
        
        res.status(400).json({errorMesssage:"not updated"})

    })
}











module.exports={loginUser,signUpUser,verified,verifiy,resetPassword,setNewpass , getCurrentUser,updateUser}