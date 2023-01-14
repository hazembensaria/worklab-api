
const Worklab=require("../Models/worklab");
const mongoose=require("mongoose");

const create = (req ,res)=>{
    const worklab=new Worklab({
        auther : req.userData.userId,
        name:req.body.name,
        problemId: req.body.problemId
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

const addMessage =(req ,res)=>{
    const message ={
        msg : req.body.message ,
        name :req.body.name ,
        sender : req.userData.userId,
        date : new Date()
    }

    Worklab.updateOne({_id : req.body.id} , {$push: {chat : message}}).then(updt=>{
        res.status(201).send(updt);
    }).catch(err=>{
        console.log(err);
    })

}

// ---------------------------------- save code in worklab--------------------------------------
const saveCode = (req , res)=>{
    Worklab.updateOne({ _id: req.body.id }, { $set: { code: req.body.code} }).then(result => {

        res.status(200).send(result)
    })
        .catch(err => {
            console.log('ici c l erreure' + err)
        })
}

// ----------------------------- delete participant from worklab -------------------------------------

const deleteParticipant = (req ,res)=>{
    Worklab.updateOne({_id : req.body.worklabId}, {$pull:{"participants" :{id: req.body.idParticipant}}}).then(deleted=>{
        res.status(201).send(deleted)

    })
}

module.exports={create , getWorklab , join , addParticipant ,addMessage , saveCode , deleteParticipant}