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
exports.insertCountry = function(query) {
    return new Promise((resolve, reject) =>{
        let countryInsertQuery={
            nama:query.Name,
            kode_negara:(query.CountryCode).toUpperCase(),
            bahasa:query.Language,
            kode_bahasa:(query.LanguageCode).toLowerCase(),
            jenis:query.Type
        };
        countriesCollection.insertOne(countryInsertQuery, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    });
};
exports.checkCountryExistsByCode=function (CountryCode) {
    return new Promise((resolve,reject)=>{
        countriesCollection.find({kode_negara:CountryCode}).toArray(function (err,results) {
            if(err)reject(err);
            else {
                if(results.length>0)resolve(true);
                else resolve(false);
            }
        });
    });
};
exports.updateCountryByCountryID=(query)=>{
    return new Promise((resolve,reject)=>{
        countriesCollection.updateOne(
            {
                _id:new ObjectId(query.CountryID)
            },
            {
                $set:{
                    nama:query.Name,
                    kode_negara:(query.CountryCode).toUpperCase(),
                    bahasa:query.Language,
                    kode_bahasa:(query.LanguageCode).toLowerCase(),
                    jenis:query.Type
                }
            }
            ,function (err,result) {
                if(err)reject(err);
                else resolve(result);
            })
    });
};
exports.getCountryByID=(query)=>{
    return new Promise((resolve,reject)=>{
        countriesCollection.findOne(
            {
                _id:new ObjectId(query.CountryID)
            }
            ,function (err,result) {
                if(err)reject(err);
                else resolve(result);
            })
    });
};