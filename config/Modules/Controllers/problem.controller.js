const bcrypt=require("bcrypt");
const Problem =require('../Models/Problem');
const User=require('../Models/user')


const addProblem=(req,res,next)=>{

    
    const password=req.body.password;
    const email=req.body.email;

    User.findOne({email:email}).then(async(user)=>{

      bcrypt.compare(password,user.password).then(isSame=>{

        if(!isSame){
            return res.status(404).json({message:"password incorrect",added:false})
        }
        else {

            const problem=new Problem(req.body.problem).save().then(problem=>{
                return res.status(200).json({message:"add succecfuly",added:true})
            }).catch(err=>{
                return res.status(500).json({message:"opps serveur error !",added:false});
            })
            
            

        }
        

      }).catch(err=>{
            res.status(500).json({message:"oops error please try again later!",same:false})
      })

    }).catch(err=>{
        return res.status(404).json({message:"user Not found"});
    })

    

}

module.exports={addProblem}