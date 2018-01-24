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
exports.getAllQuestion=function () {
    return new Promise((resolve,reject)=>{
        questionsCollection.find({status:1}).toArray(function (err,results) {
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