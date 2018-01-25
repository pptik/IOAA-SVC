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