var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var setup = require('./routes/setup');
var missions = require('./routes/missions');
var password = require('./routes/password');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', __dirname);
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));

app.use('/', index);
app.use('/setup', setup);
app.use('/missions', missions);
app.use('/password', password);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('./src/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('./src/error', {
    message: err.message,
    error: {}
  });
});

// initalize socket
io.on('connection', function(socket) {
  socket.on('orientation-display', function(data) {
    socket.broadcast.emit('orientation-display', data);
  });
  socket.on('orientation-rankings', function(data) {
    io.emit('orientation-rankings', data);
  });

  // socket.on('teams-update', function(data) {
  //   socket.broadcast.emit('update-roster', data);
  // });
  // socket.on('points-update', function(data) {
  //   socket.broadcast.emit('points-update', data);
  // });



  // socket.on('assemble', function(data) {
  //   io.emit('assemble', data);
  // });
  // socket.on('add-team', function(data) {
  //   io.emit('add-team', data);
  // });
  // socket.on('delete-team', function(data) {
  //   io.emit('delete-team', data);
  // });
  // socket.on('update-team', function(data) {
  //   socket.broadcast.emit('update-team', data);
  // });
  // socket.on('reminded', function(data) {
  //   io.emit('reminded', data);
  // });
});

// listen on port
port = Number(process.env.PORT || 9000);
server.listen(port, function(data) {
  console.log('Server listening on port ' + port);
});


module.exports = app;
