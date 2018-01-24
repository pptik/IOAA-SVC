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
module.exports = router;
