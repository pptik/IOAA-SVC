let express = require('express');
let router = express.Router();
let message = require('../setup/messages.json');
let sessionModel=require('../model/session_model');
let questionsModel=require('../model/questions_model');
let cors = require('cors');
app.use(cors());
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
                res.status(200).send({success: true, message:"Success get questions", listQuestions:listQuestion });
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/get/active', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    if(SessID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let listQuestion=await questionsModel.getAllActiveQuestion();
                res.status(200).send({success: true, message:"Success get questions", listQuestions:listQuestion });
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/delete/by/id', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let QuestionID=query.QuestionID;
    if(SessID===undefined||QuestionID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                await questionsModel.setQuestionsToExpired(QuestionID);
                res.status(200).send({success: true, message:"Question Status Become Deleted" });
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/insert/translation', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let QuestionID=query.QuestionID;
    let Language=query.Language;
    let LanguageCode=query.LanguageCode;
    let TranslatedQuestion=query.TranslatedQuestion;
    if(SessID===undefined||QuestionID===undefined||Language===undefined||LanguageCode===undefined||TranslatedQuestion===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                //check question by id with language and language code exists
                if(await questionsModel.checkQuestionTranslateExistByQuestionIDLanguageAndLanguageCode(query)){

                }else {

                }
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
module.exports = router;
