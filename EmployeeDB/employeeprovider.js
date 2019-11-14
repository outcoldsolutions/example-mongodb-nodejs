var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

EmployeeProvider = function(db) {
  this.db = db;
};

EmployeeProvider.prototype.getCollection= function(callback) {
  this.db.collection('employees', function(error, employee_collection) {
    if( error ) callback(error);
    else callback(null, employee_collection);
  });
};

//find all employees
EmployeeProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error)
      else {
        employee_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find an employee by ID
EmployeeProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error)
      else {
        employee_collection.findOne({_id: ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};


//save new employee
EmployeeProvider.prototype.save = function(employee, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error)
      else {
        employee.created_at = new Date();
        employee_collection.insertOne(employee, function() {
          callback(null, employee);
        });
      }
    });
};

// update an employee
EmployeeProvider.prototype.update = function(employeeId, employee, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error);
      else {
        employee_collection.updateOne(
					{_id: ObjectID.createFromHexString(employeeId)},
					{$set: employee},
          {upsert:true},
					function(error, employee) {
						if(error) callback(error);
						else callback(null, employee)       
					});
      }
    });
};

//delete employee
EmployeeProvider.prototype.delete = function(employeeId, callback) {
	this.getCollection(function(error, employee_collection) {
		if(error) callback(error);
		else {
			employee_collection.deleteOne(
				{_id: ObjectID.createFromHexString(employeeId)},
				function(error, employee){
					if(error) callback(error);
					else callback(null, employee)
				});
			}
	});
};

exports.EmployeeProvider = EmployeeProvider;