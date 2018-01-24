app = require('../app');
db = app.db;

ObjectId=app.ObjectId;
bcrypt=app.bcrypt;
salt=app.salt;
let usersCollection=db.collection('users');

exports.insertUser = function(query) {
    return new Promise((resolve, reject) =>{
        let userQuery={
            name:query.Name,
            id_country:new ObjectId(query.CountryID),
            code:query.Code,
            password:bcrypt.hashSync(query.Code, salt),
            gender:query.Gender,
            salutation:query.Salutation,
            email:query.Email,
            birthday:query.BirthDay,
            no_passport:"-",
            passport_expired:"-",
            reg:0,
            status:0,
            visa_letter:"-",
            received:0,
            visa_status:"-",
            tl:"-",
            st:"-",
            ob:"-",
            photo:"http://filehosting.pptik.id/ioaa/defaultphoto.png",
            shirt_size:"-",
            religion:"-",
            civil_status:"-",
            diet_preference:"-",
            note:"-",
            privilege:parseInt(query.Privilege)
        };
        usersCollection.insertOne(userQuery, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    });
};
exports.getAllUser=function () {
  return new Promise((resolve,reject)=>{
      usersCollection.find().toArray(function (err,results) {
          if(err)reject(err);
          else resolve(results);
      })
  })
};
exports.getUserByPrivileges=function (Privilege) {
  return new Promise((resolve,reject)=>{
      usersCollection.find({privilege:parseInt(Privilege)}).toArray(function (err,results) {
          if(err)reject(err);
          else resolve(results);
      })
  })
};
exports.promiseFindUserByKode= (Kode) => {
    return new Promise((resolve, reject)=>{
        usersCollection.findOne({code:Kode},function (err,result) {
            if (err)reject(err);
            else resolve(result);
        });
    });
};
exports.checkUserExistsByKode=function (Kode) {
    return new Promise((resolve,reject)=>{
        usersCollection.find({code:Kode}).toArray(function (err,results) {
            if(err)reject(err);
            else {
                if(results.length>0)resolve(true);
                else resolve(false);
            }
        });
    });
};