let express = require('express');
let router = express.Router();
let message = require('../setup/messages.json');
let sessionModel=require('../model/session_model');
let gradesModel=require('../model/grades_model');
let cors = require('cors');
app.use(cors());

router.post('/get/all', async(req, res) => {
    let query = req.body;
    console.log(query);

        try{

                let listGrade=await gradesModel.getAllGrades();
                res.status(200).send({success: false, message:"Success get questions", listgrade:listGrade });

        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }

});

module.exports = router;
