let express = require('express');
let router = express.Router();
let message = require('../setup/messages.json');
let sessionModel=require('../model/session_model');
let countriesModel=require('../model/countries_model');
let cors = require('cors');
app.use(cors());



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
                let ListCountry=await countriesModel.getAllCountry();
                res.status(200).send({success: true, message: "Success Get Data",listcountry:ListCountry});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});

router.post('/create', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let Name=query.Name;
    let CountryCode=query.CountryCode;
    let Language=query.Language;
    let LanguageCode=query.LanguageCode;
    let Type=query.Type;
    if(SessID===undefined||Name===undefined||CountryCode===undefined||Language===undefined||LanguageCode===undefined||Type===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                if(await countriesModel.checkCountryExistsByCode(CountryCode)){
                    res.status(200).send({success:false,message:"Country by code "+CountryCode+" Already Exists"})
                }else {
                    await countriesModel.insertCountry(query);
                    res.status(200).send({success: true, message: "Success Insert Country"});
                }
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/update', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let CountryID=query.CountryID;
    let Name=query.Name;
    let CountryCode=query.CountryCode;
    let Language=query.Language;
    let LanguageCode=query.LanguageCode;
    let Type=query.Type;
    if(CountryID===undefined||SessID===undefined||Name===undefined||CountryCode===undefined||Language===undefined||LanguageCode===undefined||Type===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                await countriesModel.updateCountryByCountryID(query);
                res.status(200).send({success: true, message: "Success Update Country"});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/get/by/id', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let CountryID=query.CountryID;
    if(CountryID===undefined||SessID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let CountryDetail=await countriesModel.getCountryByID(query);
                res.status(200).send({success: true, message: "Success",countrydetail:CountryDetail});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
module.exports = router;
