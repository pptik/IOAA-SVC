let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let http = require('http');
let ObjectId = require('mongodb').ObjectID;
let bcrypt = require('bcryptjs');
let salt = bcrypt.genSaltSync(10);
const debug = require('debug')('privatq-svc:server');
const database = require('./setup/database');


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
database.connect(function (err, db) {
    if(err){
        console.log(err);
    } else {

        app.use(function(err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });
        const port = normalizePort(process.env.PORT || '3033');
        app.set('port', port);
        const server = http.createServer(app);
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
        let io = require('socket.io').listen(server);
        function normalizePort(val) {
            let port = parseInt(val, 10);
            if (isNaN(port)) {
                return val;
            }
            if (port >= 0) {
                return port;
            }
            return false;
        }

        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            const bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }

        function onListening() {
            let addr = server.address();
            let bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            debug('Listening on ' + bind);
        }

        io.on('connection', function(socket){
            console.log('a user connected');
            socket.on('disconnect', function(){
                console.log('user disconnected');
            });
        });
        app.io = io;
        app.db = db;
        app.ObjectId=ObjectId;
        app.bcrypt=bcrypt;
        app.salt=salt;
        module.exports = app;
        let index = require('./routes/index');
        let users = require('./routes/users');
        let questions=require('./routes/questions');
        let moderationSchedules=require('./routes/moderation_schedules');
        let grades=require('./routes/grades');
        let countries=require('./routes/countries');
        let examTimers=require('./routes/exam_timers');
        app.use('/', index);
        app.use('/api/users', users);
        app.use('/api/questions',questions);
        app.use('/api/moderation/schedules',moderationSchedules);
        app.use('/api/grades',grades);
        app.use('/api/countries',countries);
        app.use('/api/exam/timers',examTimers);

        app.use(function(req, res, next) {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }
});

module.exports = app;
