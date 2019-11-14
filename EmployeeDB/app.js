/**
 * Module dependencies.
 */

var express = require('express')
  , bodyParser = require('body-parser')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , EmployeeProvider = require('./employeeprovider').EmployeeProvider;

// Expose Prometheus Metrics
const { createMiddleware } = require('@promster/express');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.set('view options', {layout: false});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('method-override')());
app.use(require('errorhandler')());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(createMiddleware({ app }));

var MongoClient = require('mongodb').MongoClient;
mongoDBClient = new MongoClient('mongodb://mongo:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
mongoDBClient.connect(function(err) {
  var employeeProvider = new EmployeeProvider(mongoDBClient.db('node-mongo-employee'));

  //Routes
  //index
  app.get('/', function(req, res){
    employeeProvider.findAll(function(error, emps){
        res.render('index', {
              title: 'Employees',
              employees:emps
          });
    });
  });

  //new employee
  app.get('/employee/new', function(req, res) {
      res.render('employee_new', {
          title: 'New Employee'
      });
  });

  //save new employee
  app.post('/employee/new', function(req, res){
      employeeProvider.save({
          title: req.body['title'],
          name: req.body['name']
      }, function( error, docs) {
          res.redirect('/')
      });
  });

  //update an employee
  app.get('/employee/edit', function(req, res) {
    employeeProvider.findById(req.query['_id'], function(error, employee) {
      res.render('employee_edit',
      { 
        title: employee.title,
        employee: employee
      });
    });
  });

  //save updated employee
  app.post('/employee/edit', function(req, res) {
    employeeProvider.update(req.query['_id'],{
      title: req.body['title'],
      name: req.body['name']
    }, function(error, docs) {
      res.redirect('/')
    });
  });

  //delete an employee
  app.post('/employee/delete', function(req, res) {
    employeeProvider.delete(req.body['_id'], function(error, docs) {
      res.redirect('/')
    });
  });

  app.listen(process.env.PORT || 3000);
});

const { createServer } = require('@promster/server');

// NOTE: The port defaults to `7788`.
createServer({ port: 7788 }).then(server =>
  console.log(`@promster/server started on port 7788.`)
);
