let express = require('express');
let router = express.Router();
let message = require('../setup/messages.json');
let userModel=require('../model/users_model');
let sessionModel=require('../model/session_model');
bcrypt = app.bcrypt;
let cors = require('cors');
app.use(cors());
router.post('/signin', async(req, res) => {
    let query = req.body;
    console.log(query);
    let Kode=query.Kode;
    let Password=query.Password;
    if(Kode===undefined||Password===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            let dataUser=await userModel.promiseFindUserByKode(Kode);
            if(dataUser){
                if(bcrypt.compareSync(Password,dataUser.password)){
                    await sessionModel.promiseInitSession(String(dataUser._id));
                    let sessionID=await sessionModel.promiseGetSession(String(dataUser._id));
                    res.status(200).send({success:true,message:"Berhasil Login",profile:dataUser,sessionid:sessionID});
                }else res.status(200).send(message.code_or_password_invalid);
            }else res.status(200).send(message.code_or_password_invalid);
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
    let CountryID=query.CountryID;
    let Code=query.Code;
    let Gender=query.Gender;
    let Salutation=query.Salutation;
    let Email=query.Email;
    let BirthDay=query.BirthDay;
    let Privilege=query.Privilege;
    if(Privilege===undefined|| BirthDay===undefined|| Email===undefined|| Salutation===undefined||
        Gender===undefined|| Code===undefined|| CountryID===undefined|| SessID===undefined||Name===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                if(await userModel.checkUserExistsByKode(Code)){
                    res.status(200).send({success:false,message:"User by code "+Code+" Already Exists"})
                }else {
                    await userModel.insertUser(query);
                    res.status(200).send({success: true, message: "Success Insert User"});
                }
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/test', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let Name=query.Name;
    let CountryID=query.CountryID;
    let Code=query.Code;
    let Gender=query.Gender;
    let Salutation=query.Salutation;
    let Email=query.Email;
    let BirthDay=query.BirthDay;
    let Privilege=query.Privilege;
    if(Privilege===undefined|| BirthDay===undefined|| Email===undefined|| Salutation===undefined||
        Gender===undefined|| Code===undefined|| CountryID===undefined|| SessID===undefined||Name===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            await userModel.insertUser(query);
            res.status(200).send({success: true, message: "Success Insert User"});
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
                let ListUser=await userModel.getAllUsersWithCountry();
                res.status(200).send({success: true, message: "Success Get Data",listuser:ListUser});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/get/by/privilege', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let Privilege=query.Privilege;
    if(SessID===undefined||Privilege===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let ListUser=await userModel.getUserByPrivileges(Privilege);
                res.status(200).send({success: true, message: "Success Get Data",listuser:ListUser});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/change/password', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let UseriD=query.UserID;
    let OldPassword=query.OldPassword;
    let NewPassword=query.NewPassword;
    if(SessID===undefined||UseriD===undefined||OldPassword===undefined||NewPassword===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let UserData=await userModel.FindUserByID(UseriD);
                if(bcrypt.compareSync(OldPassword,UserData.password)){
                    await userModel.updatePasswordUserByID(query);
                    res.status(200).send({success: true, message: "Berhasil Mengubah Password"});
                }else res.status(200).send(message.invalid_old_password);
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
    let Name=query.Name;
    let UserID=query.UserID;
    let CountryID=query.CountryID;
    let Code=query.Code;
    let Gender=query.Gender;
    let Salutation=query.Salutation;
    let Email=query.Email;
    let BirthDay=query.BirthDay;
    let Privilege=query.Privilege;
    let PassportID=query.PassportID;
    let PassportExpiredDate=query.PassportExpiredDate;
    let Reg=query.Reg;
    let Status=query.Status;
    let VisaLetter=query.VisaLetter;
    let Received=query.Received;
    let VisaStatus=query.VisaStatus;
    let TL=query.TL;
    let ST=query.ST;
    let OB=query.OB;
    let Photo=query.Photo;
    let ShirtSize=query.ShirtSize;
    let Religion=query.Religion;
    let CivilStatus=query.CivilStatus;
    let DietPreferencec=query.DietPreference;
    let Note=query.Note;
    if(UserID===undefined|| Privilege===undefined|| BirthDay===undefined|| Email===undefined|| Salutation===undefined||
        Gender===undefined|| Code===undefined|| CountryID===undefined|| SessID===undefined||Name===undefined||
        PassportID===undefined||PassportExpiredDate===undefined||Reg===undefined||Status===undefined||
        VisaLetter===undefined||Received===undefined||VisaStatus===undefined||TL===undefined||ST===undefined||
        OB===undefined||Photo===undefined||ShirtSize===undefined||Religion===undefined||CivilStatus===undefined||
        DietPreferencec===undefined||Note===undefined
    ){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                await userModel.updateUserByUserID(query);
                res.status(200).send({success: true, message: "Success Update User"});
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
    let UserID=query.UserID;
    if(UserID===undefined||SessID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let UserDetail=await userModel.FindUserByID(UserID);
                res.status(200).send({success: true, message: "Success",userdetail:UserDetail});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
module.exports = router;