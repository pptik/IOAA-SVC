let express = require('express');
let router = express.Router();
let message = require('../setup/messages.json');
let sessionModel=require('../model/session_model');
let cors = require('cors');
app.use(cors());
const translate = require('google-translate-api');


router.post('/to/english', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let OriginalText=query.OriginalText;
    if(SessID===undefined||OriginalText===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let TranslatedText="";
                let TranslatedLanguage="";
                let TranslatedError=false;
               await translate(OriginalText, {to: 'en'}).then(res => {
                    console.log(res.text);
                    console.log(res.from.language.iso);
                    TranslatedText=res.text;
                    TranslatedLanguage=res.from.language.iso
                }).catch(err => {
                    console.error(err);
                    TranslatedError=err;
                    //res.status(200).send({success: false, message: "Error",error:err});
                });
               if(!TranslatedError){
                   res.status(200).send({success: true, message: "Success",translated:TranslatedText,language:TranslatedLanguage});
               }else {
                   res.status(200).send({success: false, message: "Error", log:TranslatedError});
               }
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/from/english', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let OriginalText=query.OriginalText;
    let RequestedLanguage=query.RequestedLanguage;
    if(SessID===undefined||OriginalText===undefined||RequestedLanguage===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let TranslatedText="";
                let TranslatedLanguage="";
                let TranslatedError=false;
               await translate(OriginalText, {to: RequestedLanguage}).then(res => {
                    TranslatedText=res.text;
                    TranslatedLanguage=res.from.language.iso
                }).catch(err => {
                    TranslatedError=err;
                });
               if(!TranslatedError){
                   res.status(200).send({success: true, message: "Success",translated:TranslatedText,language:TranslatedLanguage});
               }else {
                   res.status(200).send({success: false, message: "Error", log:TranslatedError});
               }
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
module.exports = router;