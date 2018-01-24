app = require('../app');
let md5 = require('md5');
let moment 	= require('moment');
db = app.db;

let sessionCollection=db.collection('session');

exports.initSession=function (UserID,callback) {
  sessionCollection.find({"userid":UserID,"endtime":"0000-00-00 00:00:00"}).toArray(function (err,results) {
    if(err){
        callback(err,null);
    } else {
        if (results[0]){
            sessionCollection.updateOne({id:results[0].id},{$set:{endtime:moment().format('YYYY-MM-DD HH:mm:ss')}},function (err,result) {
               if (err){
                   callback(err,null);
               }
            });
        }
        var dataArray={
            userid:UserID,
            id:md5(UserID+"-"+moment().format('YYYYMMDDHHmmss')),
            starttime:moment().format('YYYY-MM-DD HH:mm:ss'),
            lasttime:moment().format('YYYY-MM-DD HH:mm:ss'),
            endtime: "0000-00-00 00:00:00"
        };
        sessionCollection.insertOne(dataArray,function (err,result) {
           if (err){
               callback(err,null);
           }else {
               callback(null,result);
           }
        });
    }
  });
};

exports.getSession=function (UserID,callback) {
  sessionCollection.find({"userid":UserID,"endtime":"0000-00-00 00:00:00"}).toArray(function (err,results) {
     if (err){
         callback(err,null);
     }else {
         callback(null,results[0].id);
     }
  });
};
exports.checkSession=function (SessID,callback) {
    sessionCollection.find({id:SessID,"endtime":"0000-00-00 00:00:00"}).toArray(function (err,results) {
       if (err){
           callback(err,null);
       }else {
           if(results[0]){
               callback(null,results[0].userid);
           }else {
               callback(null,null);
           }
       }
    });
};
exports.promiseInitSession= (UserID) => {
    return new Promise((resolve, reject)=>{
        sessionCollection.find({"userid":UserID,"endtime":"0000-00-00 00:00:00"}).toArray(function (err,results) {
            if(err)reject(err);
            else {
                if (results[0]){
                    sessionCollection.updateOne({id:results[0].id},{$set:{endtime:moment().format('YYYY-MM-DD HH:mm:ss')}},function (err,result) {
                        if(err)reject(err);
                    });
                }
                var dataArray={
                    userid:UserID,
                    id:md5(UserID+"-"+moment().format('YYYYMMDDHHmmss')),
                    starttime:moment().format('YYYY-MM-DD HH:mm:ss'),
                    lasttime:moment().format('YYYY-MM-DD HH:mm:ss'),
                    endtime: "0000-00-00 00:00:00"
                };
                sessionCollection.insertOne(dataArray,function (err,result) {
                    if(err)reject(err);
                    else resolve(result)
                });
            }
        });
    });
};
exports.promiseGetSession= (UserID) =>  {
    return new Promise((resolve, reject)=>{
        sessionCollection.find({"userid":UserID,"endtime":"0000-00-00 00:00:00"}).toArray(function (err,results) {
            if (err) reject(err);
            else resolve(results[0].id);
        });
    });
};
exports.promiseCheckSession= (SessID) => {
    return new Promise((resolve, reject)=>{
        sessionCollection.find({id:SessID,"endtime":"0000-00-00 00:00:00"}).toArray(function (err,results) {
            if (err)reject(err);
            else {
                if(results[0]){
                    resolve(results[0].userid);
                }else {
                    resolve(null);
                }
            }
        });
    });
};