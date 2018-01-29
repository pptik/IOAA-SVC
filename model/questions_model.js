app = require('../app');
db = app.db;
ObjectId=app.ObjectId;
let questionsCollection=db.collection('questions');

exports.createQuestion = function(query) {
    return new Promise((resolve, reject) =>{
        let questionQuery={
            nomor:parseInt(query.Number),
            status:1,
            deskripsi:[
                {
                    bahasa:"English",
                    kode_bahasa:"en",
                    pertanyaan:query.Description
                }
            ],
            juri:[],
            jawaban:[]
        };
        questionsCollection.insertOne(questionQuery, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    });
};
exports.checkQuestionByNumber=function (Number) {
  return new Promise((resolve,reject)=>{
      questionsCollection.find({nomor:parseInt(Number),status:1}).toArray(function (err,results) {
          if(err)reject(err);
          else {
              if(results.length>0)resolve(true);
              else resolve(false);
          }
      });
  });
};
exports.getAllActiveQuestion=function () {
    return new Promise((resolve,reject)=>{
        questionsCollection.find({status:1}).toArray(function (err,results) {
            if(err)reject(err);
            else resolve(results);
        })
    })
};
exports.getAllQuestion=function () {
    return new Promise((resolve,reject)=>{
        questionsCollection.find().toArray(function (err,results) {
            if(err)reject(err);
            else resolve(results);
        })

    })
};
exports.setQuestionsToExpired= (QuestionID) => {
    return new Promise((resolve, reject)=>{
        let questionUpdateQuery = {
            status:2
        };
        questionsCollection.updateOne({_id:new ObjectId(QuestionID)},{$set:questionUpdateQuery},function (err,result) {
            if (err)reject(err);
            else resolve(true);
        });
    });
};

exports.checkQuestionTranslateExistByQuestionIDLanguageAndLanguageCode=(query)=>{
  return new Promise((resolve,reject)=>{
      let findQuestionQuery={
          _id:new ObjectId(query.QuestionID),
          deskripsi:{
              $elemMatch:{
                  bahasa:query.Language,
                  kode_bahasa:query.LanguageCode
              }
          }
      };
      questionsCollection.find(findQuestionQuery).toArray(function (err,result) {
          if(err)reject(err);
          else {
              if(result.length>0)resolve(true);
              else resolve(false);
          }
      })
  });
};
exports.insertTranslatedQuestionByQuestionID=(query)=>{
    return new Promise((resolve,reject)=>{
        let pushQuestionQuery={
            bahasa:query.Language,
            kode_bahasa:(query.LanguageCode).toLowerCase(),
            pertanyaan:query.TranslatedQuestion
        };
        questionsCollection.updateOne({_id:new ObjectId(query.QuestionID)},{$push:{deskripsi:pushQuestionQuery}},function (err,result) {
            if(err)reject(err);
            else resolve(result);
        })
    });
};
exports.updateTranslatedQuestionByQuestionID=(query)=>{
    return new Promise((resolve,reject)=>{
        questionsCollection.updateOne(
            {
                _id:new ObjectId(query.QuestionID),
                "deskripsi.kode_bahasa":(query.LanguageCode).toLowerCase()
            },
            {
                $set:{
                    "deskripsi.$.pertanyaan":query.TranslatedQuestion
                }
            }
        ,function (err,result) {
            if(err)reject(err);
            else resolve(result);
        })
    });
};
exports.checkIfJuryAlreadyAddedToQuestionByQuestionID=(query)=>{
    return new Promise((resolve,reject)=>{
        let findQuestionQuery={
            _id:new ObjectId(query.QuestionID),
            juri:new ObjectId(query.JuryID)
        };
        questionsCollection.find(findQuestionQuery).toArray(function (err,result) {
            if(err)reject(err);
            else {
                if(result.length>0)resolve(true);
                else resolve(false);
            }
        })
    });
};
exports.insertJuryToQuestionByQuestionID=(query)=>{
    return new Promise((resolve,reject)=>{
        questionsCollection.updateOne({_id:new ObjectId(query.QuestionID)},{$push:{juri:new ObjectId(query.JuryID)}},function (err,result) {
            if(err)reject(err);
            else resolve(result);
        })
    });
};
exports.removeJuryFromQuestionByQuestionID=(query)=>{
    return new Promise((resolve,reject)=>{
        questionsCollection.updateOne({_id:new ObjectId(query.QuestionID)},
            {$pull:
                {
                    juri:new ObjectId(query.JuryID)
                }
            },function (err,result) {
            if(err)reject(err);
            else resolve(result);
        })
    });
};
exports.updateOriginalQuestionByQuestionID=(query)=>{
    return new Promise((resolve,reject)=>{
        questionsCollection.updateOne(
            {
                _id:new ObjectId(query.QuestionID),
                "deskripsi.kode_bahasa":"en"
            },
            {
                $set:{
                    "deskripsi.$.pertanyaan":query.EnglishQuestion
                }
            }
            ,function (err,result) {
                if(err)reject(err);
                else resolve(result);
            })
    });
};
exports.checkParticipantAnswerByQuestionID=(query)=>{
    return new Promise((resolve,reject)=>{
        questionsCollection.aggregate([
            {$match:
                {
                    _id:new ObjectId(query.QuestionID),
                    "jawaban.participant":new ObjectId(query.ParticipantID)
                }
            },
            {
              $project:
                  {
                      jawaban:
                          {
                              $filter:
                                  {
                                      input:"$jawaban",
                                      as:"jawaban",
                                      cond:
                                          {
                                              $eq:["$$jawaban.participant",new ObjectId(query.ParticipantID)]
                                          }
                                  }
                          },
                      _id:0
                  }
            },{$unwind:"$jawaban"}
        ],function (err,results) {
            if(err)reject(err);
            else {
                if(results.length>0){
                    resolve(results[0]);
                }else {
                    resolve(false);
                }
            }
        })
    });
};

exports.insertNewParticipantAnswerToQuestion=(query)=>{
    return new Promise((resolve,reject)=>{
        let pushAnswerQuery={
            participant:new ObjectId(query.ParticipantID),
            jawaban_participant:query.ParticipantAnswer,
            count:1
        };
        questionsCollection.updateOne({_id:new ObjectId(query.QuestionID)},{$push: {jawaban:pushAnswerQuery}},function (err,result) {
            if(err)reject(err);
            else resolve(result);
        })
    });
};
exports.updateParticipantAnswerByQuestionID=(query,count)=>{
    return new Promise((resolve,reject)=>{
        questionsCollection.updateOne(
            {
                _id:new ObjectId(query.QuestionID),
                "jawaban.participant":new ObjectId(query.ParticipantID)
            },
            {
                $set:{
                    "jawaban.$.jawaban_participant":query.ParticipantAnswer,
                    "jawaban.$.count":count+1
                }
            }
            ,function (err,result) {
                if(err)reject(err);
                else resolve(result);
            })
    });
};

exports.findQuestionByID= (QuestionID) => {
    return new Promise((resolve, reject)=>{
        questionsCollection.findOne({_id:new ObjectId(QuestionID)},function (err,result) {
            if (err)reject(err);
            else resolve(result);
        });
    });
};