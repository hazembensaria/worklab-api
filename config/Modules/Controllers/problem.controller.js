const bcrypt = require("bcrypt");
const Problem = require('../Models/Problem');
const User = require('../Models/user')



const addProblem = (req, res, next) => {


  const password = req.body.password;
  console.log("hello from pass add problem:", password);
  const email = req.body.email;

  User.findOne({ email: email }).then(async (user) => {
    console.log("email found ");

    bcrypt.compare(password, user.password).then(isSame => {

      if (!isSame) {
        console.log("!same password");
        return res.status(404).json({ message: "password incorrect", added: false })
      }
      else {
        console.log("same pass");
        console.log(req.body.name); 
        new Problem({
          description:req.body.problem.description,
          name:req.body.problem.name,
          difficulty:req.body.problem.difficulty,
          category:req.body.problem.category
        }).save().then(problem => {
          console.log("added succecfuly",problem);
          return res.status(200).json({ message: "add succecfuly", problem:problem })
        }).catch(err => {
          console.log("serv"+err);
          return res.status(500).json({ message: "opps serveur error !", added: false });
        })



      }


    }).catch(err => {
      res.status(500).json({ message: "oops error please try again later!", added: false })
    })

  }).catch(err => {
    return res.status(404).json({ message: "user Not found", added: false });
  })



}

const getProblems = (req, res) => {

  Problem.find({}).then(problems => {
    return res.status(200).json({ problems, message: "all problems" })
  }).catch(err => {
    return res.status(500).json({ problems: null, message: "oops" })
  })
}

const getProblem=(req,res)=>{
  const ProblemId=req.params.id;
  console.log(ProblemId)
  Problem.findById(ProblemId).then(problem=>{
    return res.status(200).json({message:"problem found",problem:problem});
  }).catch (err=>res.status(404).json({message:"problem not found"}))

}


//--------------------------add comments---------------------------------------

const addcomment=(req,res)=>{
  console.log("from add comment");
  const problemId=req.body.id;
  const userId=req.userData.userId;
  const comment=req.body.comment;
  Problem.updateOne({_id:problemId},{$push:{comments:{comment,authorId:userId}}}).then(result=>{
    console.log(result);
    res.status(200).json({rows:result,userId:userId})
  })
}


module.exports = { addProblem, getProblems ,getProblem,addcomment}