app = require('../app');
db = app.db;
ObjectId=app.ObjectId;

let countriesCollection=db.collection('countries');

exports.getAllCountry= () => {
    return new Promise((resolve,reject)=>{
        countriesCollection.find().toArray(function (err,results) {
            if(err)reject(err);
            else resolve(results)
        });
    });
};

