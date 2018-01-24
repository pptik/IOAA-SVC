let express = require('express');
let router = express.Router();
let message = require('../setup/messages.json');
let sessionModel=require('../model/session_model');
let questionsModel=require('../model/questions_model');

router.post('/create', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let Number=query.Number;
    let Description=query.Description;
    if(SessID===undefined||Number===undefined||Description===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let questionExists=await questionsModel.checkQuestionByNumber(Number);
                if(questionExists){
                    res.status(200).send({success: false, message: "Question by number "+Number+" Already Exists, please use Edit if you want to change or update the question"});
                }else {
                    await questionsModel.createQuestion(query);
                    res.status(200).send({success: true, message: "Success Create Question"});
                }
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/get/all', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    if(SessID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let listQuestion=await questionsModel.getAllQuestion();
                res.status(200).send({success: false, message:"Success get questions", listQuestions:listQuestion });
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
module.exports = router;
