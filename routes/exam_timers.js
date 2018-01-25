let express = require('express');
let router = express.Router();
let message = require('../setup/messages.json');
let sessionModel=require('../model/session_model');
let examTimersModel=require('../model/exam_timer_model');
let cors = require('cors');
app.use(cors());


router.post('/update', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let StartDate=query.StartDate;
    let JamMulai=query.JamMulai;
    let EndDate=query.EndDate;
    let JamSelesai=query.JamSelesai;
    if(SessID===undefined||StartDate===undefined||JamMulai===undefined||EndDate===undefined||JamSelesai===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                await examTimersModel.updateExamTimers(query);
                res.status(200).send({success: true, message: "Success Update Exam Timers"});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});

module.exports = router;
