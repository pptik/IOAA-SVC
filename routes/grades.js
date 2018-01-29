let express = require('express');
let router = express.Router();
let message = require('../setup/messages.json');
let sessionModel=require('../model/session_model');
let gradesModel=require('../model/grades_model');
let minimumModerationPrecentage=10;
let cors = require('cors');
app.use(cors());
router.post('/insert/by/teamleader', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let QuestionID=query.QuestionID;
    let ParticipantID=query.ParticipantID;
    let TeamLeaderID=query.TeamLeaderID;
    let Grades=query.Grades;
    if(SessID===undefined||QuestionID===undefined||ParticipantID===undefined||TeamLeaderID===undefined||Grades===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let checkGradesExists=await gradesModel.checkIfGradesWithQuestionIDandParticipantIDExists(query);
                if(!checkGradesExists) {
                    await gradesModel.createGrades(query);
                }
                await gradesModel.updateGradesByTeamLeader(query);
                let detailGrade=await gradesModel.findGradeByQuestionIDandParticipantID(query);
                console.log(detailGrade);
                let countJury=0;
                let juryGrade=0;
                let finalJuryGrade=0;
                for (let i=0; i<detailGrade.nilai_juri.length;i++){
                    juryGrade+=detailGrade.nilai_juri[i].nilai;
                    countJury++;
                }
                if(countJury>0){
                    finalJuryGrade=juryGrade/countJury;
                }
                let nilaiTeamLeader=detailGrade.nilai_team_leader.nilai;
                if(nilaiTeamLeader===undefined){
                    nilaiTeamLeader=0;
                }
                if(nilaiTeamLeader<=finalJuryGrade){
                    query.Selisih=finalJuryGrade-nilaiTeamLeader;
                    query.ModerationStatus=0;
                    query.FinalGrade=(nilaiTeamLeader+finalJuryGrade)/2;
                }else {
                    if(parseInt(((nilaiTeamLeader-finalJuryGrade)/nilaiTeamLeader)*100)>=minimumModerationPrecentage){
                        query.Selisih=nilaiTeamLeader-finalJuryGrade;
                        query.ModerationStatus=1;
                        query.FinalGrade=(nilaiTeamLeader+finalJuryGrade)/2;
                    }else {
                        query.Selisih=nilaiTeamLeader-finalJuryGrade;
                        query.ModerationStatus=0;
                        query.FinalGrade=(nilaiTeamLeader+finalJuryGrade)/2;
                    }
                }
                console.log(query);
                await gradesModel.updateSelisihModerasiStatusNilaiFinal(query);
                res.status(200).send({success: true, message:"Success insert Grades"});

            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});

router.post('/insert/by/jury', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let QuestionID=query.QuestionID;
    let ParticipantID=query.ParticipantID;
    let JuryID=query.JuryID;
    let Grades=query.Grades;
    if(SessID===undefined||QuestionID===undefined||ParticipantID===undefined||JuryID===undefined||Grades===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let checkGradesExists=await gradesModel.checkIfGradesWithQuestionIDandParticipantIDExists(query);
                if(!checkGradesExists) {
                    await gradesModel.createGrades(query);
                }
                let checkIfJuryAlreadyGiveGrade=await gradesModel.checkIfJuryAlreadyGiveGradesByQuesionIDandParticipantID(query)
                if(checkIfJuryAlreadyGiveGrade){
                    await gradesModel.updateGradesByJury(query);
                }else {
                    await gradesModel.insertJuryGradesbyQuestionIDandParticipantID(query);
                }
                let detailGrade=await gradesModel.findGradeByQuestionIDandParticipantID(query);
                console.log(detailGrade);
                let countJury=0;
                let juryGrade=0;
                let finalJuryGrade=0;
                for (let i=0; i<detailGrade.nilai_juri.length;i++){
                    juryGrade+=detailGrade.nilai_juri[i].nilai;
                    countJury++;
                }
                if(countJury>0){
                   finalJuryGrade=juryGrade/countJury;
                }
                let nilaiTeamLeader=detailGrade.nilai_team_leader.nilai;
                if(nilaiTeamLeader===undefined){
                    nilaiTeamLeader=0;
                }
                if(nilaiTeamLeader<=finalJuryGrade){
                    query.Selisih=finalJuryGrade-nilaiTeamLeader;
                    query.ModerationStatus=0;
                    query.FinalGrade=(nilaiTeamLeader+finalJuryGrade)/2;
                }else {
                    if(parseInt(((nilaiTeamLeader-finalJuryGrade)/nilaiTeamLeader)*100)>=minimumModerationPrecentage){
                        query.Selisih=nilaiTeamLeader-finalJuryGrade;
                        query.ModerationStatus=1;
                        query.FinalGrade=(nilaiTeamLeader+finalJuryGrade)/2;
                    }else {
                        query.Selisih=nilaiTeamLeader-finalJuryGrade;
                        query.ModerationStatus=0;
                        query.FinalGrade=(nilaiTeamLeader+finalJuryGrade)/2;
                    }
                }
                console.log(query);
                await gradesModel.updateSelisihModerasiStatusNilaiFinal(query);
                res.status(200).send({success: true, message:"Success insert Grades"});
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
                let listGrade=await gradesModel.getListAllGradesWithoutJoins();
                for (let i=0; i<listGrade.length;i++){

                }
                res.status(200).send({success: true, message:"Success get Grades", listgrade:listGrade });
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

        try{


        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }

});

module.exports = router;
