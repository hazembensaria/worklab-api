
const Worklab=require("../Models/worklab");
const create = (req ,res)=>{
    const worklab=new Worklab({
        auther : req.userData.userId,
        name:req.body.name,
        
    }).save().then(result=>{
                res.status(200).json(result._id)
    })
}

// -------------------------------- join a worklab ----------------------------------------------------------
const join = (req , res)=>{
    console.log(req.body.id)
Worklab.findOne({_id : req.body.id}).then(worklab=>{
    console.log(worklab)
    if(worklab){
        res.status(200).send(worklab) ; 
    }
    else{
        res.status(404).send("can't find worklab") ; 

    }
}).catch(err=>{
    res.status(404).send('this is error')
    console.log("this is an id error")
    console.log(err);
})
}

// ----------------------find a specific workloab and get his credentials--------------------------------------
const getWorklab =  (req ,res)=>{
    const id = req.body.id ; 
   
    Worklab.findById(id).then(resul=>{
       
        res.json(resul)
    }, err=>{
        console.log(err)
    })
}
// ------------------------- add a participant to worklab -----------------------------------------------


const addParticipant = (req ,res)=>{
Worklab.updateOne({_id: req.body.worklabId} , {$push : {participants : {name : req.body.name , id : req.body.id}}}).then(upd=>{
        res.status(201).send(upd)
}).catch(err=>{
    console.log(err)
})
}

module.exports={create , getWorklab , join , addParticipant}