var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var Gender = require('./models/gender');
var Residency = require('./models/residency');
var AcademicLoad = require('./models/academic-load');
var Country = require('./models/country');
var Province = require('./models/province');
var City = require('./models/city');
var ITRProgram = require('./models/itr-program');
var AcademicProgramCode = require('./models/academic-program-code');
var AcademicProgramHistory = require('./models/academic-program-history');
var Student = require('./models/student');
var Faculty = require('./models/faculty');
var TermCode = require('./models/term-code');
var CourseCode = require('./models/course-code');
var Grade = require('./models/grade');
var DegreeCode = require('./models/degree-code');
var ProgramRecord = require('./models/program-record');
var DistributionResult = require('./models/distribution-result');
var CommentCode = require('./models/comment-code');
var ProgramAdministration = require('./models/program-administration');
var Department = require('./models/department');
var AdmissionRule = require('./models/admission-rule');
var LogicalExpression = require ('./models/logical-expression');
var BasisOfAdmissionCode = require ('./models/basis-of-admission-code');
var BasisOfAdmission = require ('./models/basis-of-admission');
var HighSchoolAdmissionAverage = require ('./models/high-school-admission-average');
var ScholarAndAwardCode = require ('./models/scholar-and-award-code');
var SecondarySchool = require ('./models/secondary-school');
var HighSchoolSubject = require("./models/high-school-subject")
var HighSchoolCoursesMark = require('./models/high-school-courses-mark');


var users = require('./routes/users');
var passwords = require('./routes/passwords');
var roleCodes = require('./routes/roleCodes');
var userRoles = require('./routes/usersRoles');
var rolePermissions = require('./routes/rolePermissions');
var logins = require('./routes/logins');
var roots = require('./routes/roots');
//var distributionResults = require('./routes/distributionResults');
//var distributionResults = require('./routes/distributionResults');

var port = 8082;

mongoose.connect('mongodb://localhost/sas');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, ContentType, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
    next(); // make sure we go to the next routes and don't stop here
});

app.use(express.static('/'));

app.use('/users', users);
app.use('/passwords', passwords);
app.use('/roleCodes', roleCodes);
app.use('/userRoles', userRoles);
app.use('/rolePermissions', rolePermissions);
app.use('/logins', logins);
app.use('/roots', roots);
//app.use('/distributionResults', distributionResults);


var router = express.Router();

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, ContentType, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
    next(); // make sure we go to the next routes and don't stop here
});

app.get('/', function(req, res) {
  console.log("Sending index.html file");
  res.sendfile('../../SAS/Front-End/app/index.html');
});
/*
router.route('/users', users);
router.route('/passwords', passwords);
router.route('/roleCodes', roleCodes);
router.route('/userRoles', userRoles);
router.route('/rolePermissions', rolePermissions);
router.route('/logins', logins);
router.route('/roots', roots);
*/
router.route('/genders')
  .get(function(req, res) {
    var GenderName = req.query.name;
    if(!GenderName){
      console.log("A request has been made for all genders in database.");
      Gender.find(function(err, data) {
        if (err){
          res.send(err);
          console.log("error");
          res.json({message: 'ERROR'});
        }
        else{
          console.log("Genders data sent back");
          res.json({gender: data});
        }
      });
    }
    
    else{
      console.log("A get request has been made for specific gender");
      Gender.find({"name": req.query.name}, function(error,genderData){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific gender data sent back");
          res.json({gender:genderData});
        }
      });
    }
    
  })
  .post(function (req, res) {
    console.log("A request has been made to post a new gender");
    
    var g = new Gender();
    console.log(req.body);
    g.name = req.body.gender.name;
    
    g.save(function (error) {
      if (error) {
        console.log("posting error");
        res.send({error: error});
      }
      else {
        console.log("Posting new gender");
        res.status(201).json({gender:g});
      }
    });
  });

router.route('/genders/:gender_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific gender");
      Gender.findById(req.params.gender_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific gender data sent back");
          console.log({gender: data});
          res.json({gender: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a gender");
        Gender.remove({
            _id: req.params.gender_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Gender sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('gender being modified');
    Gender.findById(req.params.gender_id, function(err, gender) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.gender.name));
        gender.name = req.body.gender.name;  // update the bears info
        gender.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'Gender updated' });
      });
    });
  });
    
router.route('/residencies')
  .get(function(req, res) {
    var ResName = req.query.name;
    if(!ResName){
    console.log("A request has been made to get residencies");
    Residency.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("Residencies data sent back");
        res.json({residency: data});
      }
    });
    }
    else{
      console.log("A get request has been made for specific res");
      Residency.find({"name": req.query.name}, function(error,resData){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific res data sent back");
          res.json({residency:resData});
        }
      });
    }
  })
  .post(function (req, res) {
    console.log("A request has been made to post a new residency");
    
    var r = new Residency();
    console.log(req.body);
    r.name = req.body.residency.name;

    r.save(function (error) {
      if (error) {
        console.log("posting error");
        res.send({error: error});
      }
      else {
        console.log("A new residency has been posted");
        res.status(201).json({residency:r});
      }
    });
  });
  
router.route('/residencies/:residency_id')
  .get(function(req, res) {
    console.log("A request has been made to get a specific residency");
    Residency.findById(req.params.residency_id, function (error, data) {
      if (error) {
        console.log("Error");
        res.send({error: error});
      }
      else {
        console.log("Specific residency data sent back");
        console.log({residency: data});
        res.json({residency: data});
      }
    });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a residency");
        Residency.remove({
            _id: req.params.residency_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Residency successfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('residency being modified');
    Residency.findById(req.params.residency_id, function(err, residency) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.residency.name));
        residency.name = req.body.residency.name;  // update the bears info
        residency.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'Residency updated' });
      });
    });
  });
    
router.route('/academicLoads')
  .get(function(req, res) {
    console.log("A get request made to academic loads");
    AcademicLoad.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("data sent back");
        res.json({academicLoad: data});
      }
    });
  })
  .post(function (req, res) {
    console.log("A post request has been made to academic loads");
    
    var a = new AcademicLoad();
    console.log(req.body);
    a.name = req.body.academicLoad.name;

    a.save(function (error) {
      if (error) {
        console.log("posting error");
        res.send({error: error});
      }
      else {
        console.log("Posting new academic load");
        res.status(201).json({academicLoad:a});
      }
    });
  });
  
router.route('/academicLoads/:academicLoad_id')
  .get(function(req, res) {
    AcademicLoad.findById(req.params.academicLoad_id, function (error, data) {
      if (error) {
        res.send({error: error});
      }
      else {
        res.json({academicLoad: data});
      }
    });
  })
  .delete(function(req, res) {
        AcademicLoad.remove({
          _id: req.params.academicLoad_id
        }, function(err, bear) {
            if (err){
              res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('academic load being modified');
    AcademicLoad.findById(req.params.academicLoad_id, function(err, academicLoad) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.academicLoad.name));
        academicLoad.name = req.body.academicLoad.name;  // update the bears info
        academicLoad.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'AcademicLoad updated' });
      });
    });
  });
  
router.route('/locations')
  .get(function(req, res) {
    console.log("A get request has been made to locations");
    Country.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All country data sent back");
        res.json({country: data});
      }
    });
  })
  .post(function(req,res) {
    console.log("A post request has been made to locations");

    var co = new Country(req.body.country);
    console.log(req.body);

    co.save(function (error) {
      if (error) {
        console.log("posting error");
        res.send({error: error});
      }
      else {
        console.log("Posting new country");
        res.status(201).json({country:co});
      }
    });
  });

router.route('/countries')
  .get(function(req, res) {
    var FilterData= req.query.filter;
    if(!FilterData){
      console.log("A request has been made to get all countries");
      Country.find(function(err, data) {
        if (err){
          res.send(err);
          console.log("error");
          res.json({message: 'ERROR'});
        }
        else{
          console.log("All country data sent back");
          res.json({country: data});
        }
      });
    }
    else{
      console.log("in else statement");
      console.log(req.query.filter.name);
      Country.findOne({"name": req.query.filter.name}, function(error,country){
        if (error){
          console.log("error finding");
          res.send(error);
        }
        else{
          console.log("Specific country data sent back");
          console.log({country: country});
          res.json({country:country});
        }
      });
    }
  })
  .post(function(req,res) {
    console.log("A post request has been made to countries")
    var co = new Country(req.body.country);
    
    co.save(function (error) {
      if (error) {
        console.log("posting error");
        res.send({error: error});
      }
      else {
        console.log("Posting a new country");
        res.status(201).json({country:co});
      }
    });
  });

router.route('/countries/:country_id')
  .get(function(req, res) {
    console.log("A request has been made to get a specific country");
    Country.findById(req.params.country_id, function (error, data) {
      if (error) {
        console.log("Error");
        res.send({error: error});
      }
      else {
        console.log("Specific country data sent back");
        console.log({country: data});
        res.json({country: data});
      }
    });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a country");
        Country.remove({
            _id: req.params.country_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Country sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('Country being modified');
    Country.findById(req.params.country_id, function(err, country) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.country.name));
        country.name = req.body.country.name;  // update the bears info
        country.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'Country updated' });
      });
    });
  });

router.route('/provinces')
  .get(function(req, res) {
    var CountryData = req.query.country;
    if(!CountryData)
    {
      console.log("A get request has been made for all provinces");
      Province.find(function(err, data) {
        if (err){
          res.send(err);
          console.log("error");
          res.json({message: 'ERROR'});
        }
        else{
          console.log("All province data sent back");
          res.json({province: data});
        }
      });
    }
    else{
      console.log("A get request has been made for specific provinces");
      Province.find({"country": req.query.country}, function(error,provinces){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific province data sent back");
          res.json({province:provinces});
        }
      });
    }
    
  })
  .post(function(req,res) {
    console.log("A post request has been made to province");
    var p = new Province(req.body.province);
    console.log(req.body);

    p.save(function (error) {
      if (error) {
        console.log("posting error");
        res.send({error: error});
      }
      else {
        console.log("posting");
        res.status(201).json({province:p});
      }
    });
  });
  
router.route('/provinces/:province_id')
  .get(function(req, res) {
    console.log("A request has been made to get a specific country");
    Province.findById(req.params.province_id, function (error, data) {
      if (error) {
        console.log("Error");
        res.send({error: error});
      }
      else {
        console.log("Specific country data sent back");
        console.log({province: data});
        res.json({province: data});
      }
    });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a province");
        Province.remove({
            _id: req.params.province_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Province sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('Province being modified');
    Province.findById(req.params.province_id, function(err, province) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.province.name));
        province.name = req.body.province.name;  // update the bears info
        province.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'Country updated' });
      });
    });
  });
  
router.route('/cities')
  .get(function(req, res) {
    var ProvinceData = req.query.province;
    
    if(!ProvinceData){
      console.log("A request for all cities has been made");
      City.find(function(err, data) {
        if (err){
          res.send(err);
          console.log("error");
          res.json({message: 'ERROR'});
        }
        else{
          console.log("All city data sent back");
          res.json({city: data});
        }
      });
    }
    else{
      console.log("Specific city data requested");
      City.find({"province": req.query.province}, function(error,cities){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific province data sent back");
          res.json({city:cities});
        }
      });
    }
  })
  .post(function(req,res) {
    console.log("A request has been made to post a new city");

    var c = new City(req.body.city);
    console.log(req.body);

    c.save(function (error) {
      if (error) {
        console.log("posting error");
        res.send({error: error});
      }
      else {
        console.log("A new city has been posted");
        res.status(201).json({city:c});
      }
    });
  });
  
router.route('/cities/:city_id')
  .get(function(req, res) {
    console.log("A request has been made to get a specific country");
    City.findById(req.params.city_id, function (error, data) {
      if (error) {
        console.log("Error");
        res.send({error: error});
      }
      else {
        console.log("Specific country data sent back");
        console.log({city: data});
        res.json({city: data});
      }
    });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a city");
        City.remove({
            _id: req.params.city_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("City sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('City being modified');
    City.findById(req.params.city_id, function(err, city) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.city.name));
        city.name = req.body.city.name;  // update the bears info
        city.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'City updated' });
      });
    });
  });
  
router.route('/students')
  .get(function(req, res) {
    var StudentData = req.query.studentID;
    if(!StudentData)
    {
      console.log("A request has been made to get data for all students");
      Student.find(function(err, data) {
          if(err){
            res.send(err);
            console.log("error");
            res.json({message: 'ERROR'});
          }
          else{
            console.log("All Student data sent back");
            res.json({student: data});
          }
      });
    }
    else{
      console.log("Specific student data requested");
      Student.findOne({"studentID": req.query.studentID}, function(error,student){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific student data sent back");
          res.json({student:student});
        }
      });
    }
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new student");
      var s = new Student(req.body.student);
      console.log(req.body.student);
      
      s.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new student has been posted");
          res.status(201).json({student:s});
        }
      })
  });
router.route('/students/:student_id')
  .get(function(req, res) {
    console.log("A request has been made to get a specific student");
    Student.findById(req.params.student_id, function (error, data) {
      if (error) {
        console.log("Error");
        res.send({error: error});
      }
      else {
        console.log("Specific student data sent back");
        console.log(data);
        res.json({student: data});
      }
    });
  })
  .put(function(req, res){
    console.log('student being modified');
    Student.findById(req.params.student_id, function(err, student) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.student));
        
        
        
        student.firstName = req.body.student.firstName;  // update the bears info
        student.lastName = req.body.student.lastName;
        student.studentID = req.body.student.studentID;
        student.dob = req.body.student.dob;
        
        if(req.body.student.gender!=null){
          student.gender = req.body.student.gender;
        }
        if(req.body.student.residency!=null){
          student.residency = req.body.student.residency;
        }
        if(req.body.student.city!=null){
          student.city = req.body.student.city;
        }
        if(req.body.student.province!=null){
          student.province = req.body.student.province;
        }
        if(req.body.student.country!=null){
          student.country = req.body.student.country;
        }
        if(req.body.student.academicLoad!=null){
          student.academicLoad = req.body.student.academicLoad;
        }
        
        student.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?");
        res.json({ message: 'Student updated' });
      });
    });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a sutdent");
        Student.remove({
            _id: req.params.student_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Student sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    });
  
router.route('/itrPrograms')
  .get(function(req, res) {
    var StudentData = req.query.student;
    var OrderData = req.query.order;
    if((!StudentData)&&(!OrderData))
    {
    console.log("Get request made to itrPrograms");
    ITRProgram.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("ItrProgram data sent back");
        res.json({itrProgram: data});
      }
    });
    }
    
    else if (!OrderData)
    {
      console.log("A get request has been made for specific itrs");
      ITRProgram.find({"student": req.query.student}, function(error,itrs){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific province data sent back");
          res.json({itrProgram:itrs});
        }
      });
    }
    else
    {
      console.log("A get request has been made for specific itrs");
      ITRProgram.findOne({
        "order": req.query.order,
        "student": req.query.student
      }, function(error,itrs){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific itr data sent back");
          res.json({itrProgram:itrs});
        }
      });
    }
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new itr program");
      var i = new ITRProgram(req.body.itrProgram);
      console.log(req.body.itrProgram);
      
      i.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new student has been posted");
          res.status(201).json({itrProgram:i});
        }
      })
  });
  
router.route('/itrPrograms/:itrProgram_id')
  .get(function(req, res) {
    console.log("A request has been made to get a specific itr");
    ITRProgram.findById(req.params.itrProgram_id, function (error, data) {
      if (error) {
        console.log("Error");
        res.send({error: error});
      }
      else {
        console.log("Specific itr data sent back");
        console.log({itrProgram: data});
        res.json({itrProgram: data});
      }
    });
  })
  .put(function(req, res){
    console.log('itr being modified');
    if(req.body.itrProgram.order!=null)
    {
      ITRProgram.findById(req.params.itrProgram_id, function(err, itr) {
          if (err){
              res.send(err);
          }
          console.log(JSON.stringify(req.body.itrProgram));
          
          itr.order = req.body.itrProgram.order;  // update the bears info
          itr.eligibility = req.body.itrProgram.eligibility;
          console.log(req.body.itrProgram.eligibility);
          console.log(itr.eligibility);
          itr.save(function(err) {
            if (err){
              res.send(err);
            }
          console.log("success?");
          res.json({ message: 'itr updated' });
        });
      });
    }
  });
  //.delete
  
router.route('/academicProgramCodes')
  .get(function(req, res) {
    var AcName= req.query.name;
    if(!AcName){
      console.log("Get request made to academic program codes");
      AcademicProgramCode.find(function(err, data) {
        if (err){
          res.send(err);
          console.log("error");
          res.json({message: 'ERROR'});
        }
        else{
          console.log("All academic program code data sent back");
          res.json({academicProgramCode: data});
        }
      });
    }
    else{
      console.log("A get request has been made for academic code");
      AcademicProgramCode.find({"name": req.query.name}, function(error,acData){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific acCode data sent back");
          res.json({academicProgramCode:acData});
        }
      });
    }
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new academic program code");
      var a = new AcademicProgramCode(req.body.academicProgramCode);
      console.log(req.body.academicProgramCode);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new student has been posted");
          res.status(201).json({academicProgramCode:a});
        }
      })
  });
  
router.route('/academicProgramCodes/:academicProgramCode_id')
  .get(function(req, res) {
    console.log(req.params.academicProgramCode_id);
    AcademicProgramCode.findById(req.params.academicProgramCode_id, function (error, data) {
      if (error) {
        console.log('error finding the code');
        res.send({error: error});
      }
      else {
        console.log('sending single academic code data back');
        res.json({academicProgramCode: data});
      }
    });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a academic program code");
        AcademicProgramCode.remove({
            _id: req.params.academicProgramCode_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Academic program code sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('academic program code being modified');
    AcademicProgramCode.findById(req.params.academicProgramCode_id, function(err, academicProgramCode) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.academicProgramCode.name));
        academicProgramCode.name = req.body.academicProgramCode.name;  // update the bears info
        academicProgramCode.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'Academic Program Code updated' });
      });
    });
  });
  
router.route('/academicProgramHistories')
  .get(function(req, res) {
    console.log("Get request made to academic program history");
    AcademicProgramHistory.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All academic program history data sent back");
        res.json({academicProgramHistory: data});
      }
    });
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new academic program code");
      var a = new AcademicProgramHistory(req.body.academicProgramHistory);
      console.log(req.body.academicProgramHistory);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new academic program history has been posted");
          res.status(201).json({academicProgramHistory:a});
        }
      })
  });
  
router.route('/styles')
  .get(function(req, res) {
    //here the response will send the style sheet once they are made
    res.sendfile('styles/app.css');
  });

router.route('/grades')
  .get(function(req, res) {
    var StudentData = req.query.student;
    var CourseData = req.query.courseCode;
    if((!StudentData)&&(!CourseData))
    {
      console.log("Get request made to grades");
      Grade.find(function(err, data) {
        if (err){
          res.send(err);
          console.log("error");
          res.json({message: 'ERROR'});
        }
        else{
          console.log("All grade data sent back");
          res.json({grade: data});
        }
      });
    }
    else if (!CourseData){
      console.log("A get request has been made for specific grades");
      Grade.find({"student": req.query.student}, function(error,grades){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific province data sent back");
          res.json({grade:grades});
        }
      });
    }
    else{
      console.log("A get request has been made for specific grades");
      console.log(req.query.student);
      console.log(req.query.courseCode);
      Grade.findOne({"student": req.query.student, "courseCode": req.query.courseCode}, function(error,grades){
        if (error){
          res.send(error); //56d322ae73cc09f287f50135
        }
        else{
          console.log("Specific very grade data sent back");
          console.log(({grades}));
          res.json({grade:grades});
        }
      });
    }
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new grade");
      var a = new Grade(req.body.grade);
      console.log(req.body.grade);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new grade has been posted");
          res.status(201).json({grade:a});
        }
      })
  });
  
router.route('/grades/:grade_id')
  .delete(function(req, res) {
    console.log("A request has been made to delete a courseCode");
        Grade.remove({
            _id: req.params.grade_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("grade code sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    });

router.route('/courseCodes')
  .get(function(req, res) {
    console.log("Get request made to course codes");
    var cCode= req.query.code;
    var cNum = req.query.number;
    if((!cCode) && (!cNum)){
      CourseCode.find(function(err, data) {
        if (err){
          res.send(err);
          console.log("error");
          res.json({message: 'ERROR'});
        }
        else{
          console.log("All term codes data sent back");
          res.json({courseCode: data});
        }
      });
    }
    else{
      console.log("A get request has been made for course code");
      CourseCode.findOne({
        "code": req.query.code,
        "number": req.query.number,
      }, function(error,cData){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific cCode data sent back");
          res.json({courseCode:cData});
        }
      });
    }
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new academic program code");
      var a = new CourseCode(req.body.courseCode);
      console.log(req.body.courseCode);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new term code has been posted");
          res.status(201).json({courseCode:a});
        }
      })
  });
  
router.route('/courseCodes/:courseCode_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific course code");
      CourseCode.findById(req.params.courseCode_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific course code data sent back");
          res.json({courseCode: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a courseCode");
        CourseCode.remove({
            _id: req.params.courseCode_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Course code sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('courseCodes being modified');
    CourseCode.findById(req.params.courseCode_id, function(err, courseCode) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.courseCode.name));
        courseCode.name = req.body.courseCode.name;  // update the bears info
        courseCode.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'Residency updated' });
      });
    });
  });

router.route('/programRecords')
  .get(function(req, res) {
    console.log("Get request made to program records");
    ProgramRecord.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All program record data sent back");
        res.json({programRecord: data});
      }
    });
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new program record");
      var a = new ProgramRecord(req.body.programRecord);
      console.log(req.body.programRecord);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new program record has been posted");
          res.status(201).json({programRecord:a});
        }
      })
  });
  
router.route('/programRecords/:programRecord_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific term code");
      ProgramRecord.findById(req.params.programRecord_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific program code data sent back");
          res.json({programRecord: data});
        }
      });
  });

router.route('/termCodes')
  .get(function(req, res) {
    var ProgramData = req.query.programRecord;
    var TermName = req.query.name;
    if((!ProgramData)&&(!TermName))
    {
    console.log("Get request made to termcodes");
    TermCode.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All term codes data sent back");
        res.json({termCode: data});
      }
    });
    }
    else if(!ProgramData){
      console.log("Specific term data requested by name");
      TermCode.findOne({"name": req.query.name}, function(error,termData){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific term data sent back");
          res.json({termCode:termData});
        }
      });
    }
    else{
      console.log("A get request has been made for specific term");
      TermCode.find({"programRecord": req.query.programRecord}, function(error,term){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific term data sent back");
          res.json({termCode:term});
        }
      });
    }
    
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new academic program code");
      var a = new TermCode(req.body.termCode);
      console.log(req.body.termCode);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new term code has been posted");
          res.status(201).json({termCode:a});
        }
      })
  });

router.route('/termCodes/:termCode_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific term code");
      TermCode.findById(req.params.termCode_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific term code data sent back");
          res.json({termCode: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a termCode");
        TermCode.remove({
            _id: req.params.termCode_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Term code sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('termCode being modified');
    TermCode.findById(req.params.termCode_id, function(err, termCode) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.termCode.name));
        termCode.name = req.body.termCode.name;  // update the bears info
        termCode.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'Term code updated' });
      });
    });
  });

router.route('/degreeCodes')
  .get(function(req, res) {
    console.log("Get request made to degreecodes");
    var DegreeName = req.query.name;
    var ProgramData = req.query.programRecord;
    if((!ProgramData)&&(!DegreeName)){
      DegreeCode.find(function(err, data) {
        if (err){
          res.send(err);
          console.log("erroren");
          res.json({message: 'ERROR'});
        }
        else{
          console.log("All degree codes data sent back");
          res.json({degreeCode: data});
        }
      });
    }
    else if(!ProgramData){
      console.log("Specific term data requested by name");
      DegreeCode.findOne({"name": req.query.name}, function(error,degData){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific term data sent back");
          res.json({degreeCode:degData});
        }
      });
    }
    else{
      console.log("A get request has been made for specific degree");
      DegreeCode.find({"programRecord": req.query.programRecord}, function(error,data){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific degree data sent back");
          res.json({degreeCode:data});
        }
      });
    }
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new degree code");
      var a = new DegreeCode(req.body.degreeCode);
      console.log(req.body.degreeCode);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new degree code has been posted");
          res.status(201).json({degreeCode:a});
        }
      })
  });
  
router.route('/degreeCodes/:degreeCode_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific degree code");
      DegreeCode.findById(req.params.degreeCode_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific degree code data sent back");
          res.json({degreeCode: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a degree Code");
        DegreeCode.remove({
            _id: req.params.degreeCode_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Degree code sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('degree code being modified');
    DegreeCode.findById(req.params.degreeCode_id, function(err, degreeCode) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.degreeCode.name));
        degreeCode.name = req.body.degreeCode.name;  // update the bears info
        degreeCode.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'DegreeCode updated' });
      });
    });
  });
  
router.route('/commentCodes')
  .get(function(req, res) {
    console.log("Get request made to comment codes");
    var DistData = req.query.distributionResult;
    if(!DistData)
    {
      CommentCode.find(function(err, data) {
        if (err){
          res.send(err);
          console.log("error");
          res.json({message: 'ERROR'});
        }
        else{
          console.log("All comment code data sent back");
          res.json({commentCode: data});
        }
      });
    }
    else{
      console.log("Specific distributionResult data requested");
      CommentCode.find({"distributionResult": req.query.distributionResult}, function(error,data){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific faculty data sent back");
          res.json({commentCode:data});
        }
      });
    }
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new comment code");
      var a = new CommentCode(req.body.commentCode);
      console.log(req.body.commentCode);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new comment code has been posted");
          res.status(201).json({commentCode:a});
        }
      })
  });
  
router.route('/commentCodes/:commentCode_id')
  .delete(function(req, res) {
    console.log("A request has been made to delete a commentCodes");
        CommentCode.remove({
            _id: req.params.commentCode_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("commentCodes sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('CommentCode being modified');
    CommentCode.findById(req.params.commentCode_id, function(err, commentCode) {
        if (err){
            res.send(err);
        }
        commentCode.code = req.body.commentCode.code;
        commentCode.progAction = req.body.commentCode.progAction;
        commentCode.Accepted = req.body.commentCode.Accepted;
        commentCode.description = req.body.commentCode.description;
        // update the bears info
        commentCode.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?");
        res.json({ message: 'comm code updated' });
      });
    });
  });
  
router.route('/programAdministrations')
  .get(function(req, res) {
    console.log("Get request made to program administrations");
    ProgramAdministration.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All program administration data sent back");
        res.json({programAdministration: data});
      }
    });
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new program administration");
      var a = new ProgramAdministration(req.body.programAdministration);
      console.log(req.body.programAdministration);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new program administration has been posted");
          res.status(201).json({programAdministration:a});
        }
      })
  });

router.route('/programAdministrations/:programAdministration_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific program administration");
      ProgramAdministration.findById(req.params.programAdministration_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific program administration data sent back");
          res.json({programAdminstration: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a program administration");
        ProgramAdministration.remove({
            _id: req.params.programAdministration_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Program Administration sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('programAdministration being modified');
    ProgramAdministration.findById(req.params.programAdministration_id, function(err, programAdministration) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.programAdminstration.name));
        programAdministration.name = req.body.programAdminstration.name;  // update the bears info
        programAdministration.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'ProgramAdministration updated' });
      });
    });
  });

router.route('/departments')
  .get(function(req, res) {
    console.log("Get request made to departments");
    Department.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All departments data sent back");
        res.json({department: data});
      }
    });
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new department");
      var a = new Department(req.body.department);
      console.log(req.body.department);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new department has been posted");
          res.status(201).json({department:a});
        }
      })
  });

router.route('/departments/:department_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific department");
     Department.findById(req.params.department_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific department data sent back");
          res.json({department: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a department");
        Department.remove({
            _id: req.params.department_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Department sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('department being modified');
    Department.findById(req.params.department_id, function(err, department) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.department.name));
        if(req.body.department.name!=null){
          department.name = req.body.department.name;  // update the bears info
        }
        if(req.body.department.faculty!=null){
          department.faculty = req.body.department.faculty;
        }
        department.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'Department updated' });
      });
    });
  });

router.route('/faculties')
  .get(function(req, res) {
    console.log("Get request made to faculty");
    var FacName = req.query.name;
    if(!FacName){
    Faculty.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All faculty data sent back");
        res.json({faculty: data});
      }
    });
    }
    else{
      console.log("Specific faculty data requested");
      Faculty.findOne({"name": req.query.name}, function(error,facultyData){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific faculty data sent back");
          res.json({faculty:facultyData});
        }
      });
    }
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new faculty");
      var a = new Faculty(req.body.faculty);
      console.log(req.body.faculty);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new faculty has been posted");
          res.status(201).json({faculty:a});
        }
      })
  });
  
router.route('/faculties/:faculty_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific faculty");
      Faculty.findById(req.params.faculty_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific faculty data sent back");
          res.json({faculty: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a faculty");
        Faculty.remove({
            _id: req.params.faculty_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Faculty sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('faculty being modified');
    Faculty.findById(req.params.faculty_id, function(err, faculty) {
        if (err){
            res.send(err);
        }
        faculty.name = req.body.faculty.name;  // update the bears info
        faculty.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?");
        res.json({ message: 'Faculty updated' });
      });
    });
  });
  
router.route('/admissionRules')
  .get(function(req, res) {
    console.log("Get request made to faculty");
    AdmissionRule.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All faculty data sent back");
        res.json({admissionRule: data});
      }
    });
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new faculty");
      var a = new AdmissionRule(req.body.admissionRule);
      console.log(req.body.admissionRule);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new faculty has been posted");
          res.status(201).json({admissionRule:a});
        }
      })
  });

router.route('/admissionRules/:admissionRule_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific admission rule");
      AdmissionRule.findById(req.params.admissionRule_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific admission rule data sent back");
          res.json({admissionRule: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a admission rule");
        AdmissionRule.remove({
            _id: req.params.admissionRule_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Admission rule sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('admission rule being modified');
    AdmissionRule.findById(req.params.admissionRule_id, function(err, admissionRule) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.admissionRule.name));
        admissionRule.name = req.body.admissionRule.name;  // update the bears info
        admissionRule.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'AdmissionRule updated' });
      });
    });
  });
  
router.route('/logicalExpressions')
  .get(function(req, res) {
    var addRule = req.query.admissionRule;
    if(!addRule)
    {
    console.log("Get request made to logical expression");
    LogicalExpression.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All logical expression data sent back");
        res.json({logicalExpression: data});
      }
    });
    }
    else
    {
      console.log("Specific logic data requested");
      LogicalExpression.find({"admissionRule": req.query.admissionRule}, function(error,data){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific logical exp data sent back");
          res.json({logicalExpression:data});
        }
      });
    }
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new expression");
      var a = new LogicalExpression(req.body.logicalExpression);
      console.log(req.body.logicalExpression);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new expression has been posted");
          res.status(201).json({logicalExpression:a});
        }
      });
  });
  
router.route('/basisOfAdmissionCodes')
  .get(function(req, res) {
    console.log("Get request made to Basis of Admission Code");
    BasisOfAdmissionCode.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All basis of admission code data sent back");
        res.json({basisOfAdmissionCode: data});
      }
    });
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new Basis of Admission Code");
      var a = new BasisOfAdmissionCode(req.body.basisOfAdmissionCode);
      console.log(req.body.basisOfAdmissionCode);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new Basis Of Admission Code has been posted");
          res.status(201).json({basisOfAdmissionCode:a});
        }
      })
  });
  
router.route('/basisOfAdmissionCodes/:basisOfAdmissionCode_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific basis of admission code");
      BasisOfAdmissionCode.findById(req.params.basisOfAdmissionCode_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific basis of admission code data sent back");
          res.json({basisOfAdmissionCode: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a basis of admission code");
        BasisOfAdmissionCode.remove({
            _id: req.params.basisOfAdmissionCode_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Basis of Admission Code sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('basis of admission code being modified');
    BasisOfAdmissionCode.findById(req.params.basisOfAdmissionCode_id, function(err, basisOfAdmissionCode) {
        if (err){
            res.send(err);
        }
        basisOfAdmissionCode.name = req.body.basisOfAdmissionCode.name;  // update the bears info
        basisOfAdmissionCode.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?");
        res.json({ message: 'Basis of Admission Code updated' });
      });
    });
  });
  
router.route('/basisOfAdmissions')
  .get(function(req, res) {
    console.log("Get request made to Basis of Admission");
    BasisOfAdmission.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All basis of admission data sent back");
        res.json({basisOfAdmission: data});
      }
    });
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new Basis of Admission");
      var a = new BasisOfAdmission(req.body.basisOfAdmission);
      console.log(req.body.basisOfAdmission);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new Basis Of Admission has been posted");
          res.status(201).json({basisOfAdmission:a});
        }
      })
  });
  
router.route('/basisOfAdmissions/:basisOfAdmission_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific basis of admission");
      BasisOfAdmission.findById(req.params.basisOfAdmission_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific basis of admission data sent back");
          res.json({basisOfAdmission: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a basis of admission");
        BasisOfAdmission.remove({
            _id: req.params.basisOfAdmission_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Basis of Admission sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('basis of admission being modified');
    BasisOfAdmission.findById(req.params.basisOfAdmission_id, function(err, basisOfAdmission) {
        if (err){
            res.send(err);
        }
        basisOfAdmission.name = req.body.basisOfAdmission.name;  // update the bears info
        basisOfAdmission.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?");
        res.json({ message: 'Basis of Admission updated' });
      });
    });
  });
  
router.route('/highSchoolAdmissionAverages')
  .get(function(req, res) {
    console.log("Get request made to Highschool Admission Average");
    HighSchoolAdmissionAverage.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All Highschool Admission Average data sent back");
        res.json({highSchoolAdmissionAverage: data});
      }
    });
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new Highschool Admission Average");
      var a = new HighSchoolAdmissionAverage(req.body.highSchoolAdmissionAverage);
      console.log(req.body.highSchoolAdmissionAverage);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new Highschool Admission Average has been posted");
          res.status(201).json({highSchoolAdmissionAverage:a});
        }
      })
  });
  
router.route('/highSchoolAdmissionAverages/:highSchoolAdmissionAverage_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific basis of admission");
      HighSchoolAdmissionAverage.findById(req.params.highSchoolAdmissionAverage_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific high school admission average data sent back");
          res.json({highSchoolAdmissionAverage: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a high school admission average");
        HighSchoolAdmissionAverage.remove({
            _id: req.params.highSchoolAdmissionAverage_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("High School Admission Average sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('High School Admission Average being modified');
   HighSchoolAdmissionAverage.findById(req.params.highSchoolAdmissionAverage_id, function(err, highSchoolAdmissionAverage) {
        if (err){
            res.send(err);
        }
        highSchoolAdmissionAverage.name = req.body.highSchoolAdmissionAverage.name;  // update the bears info
        highSchoolAdmissionAverage.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?");
        res.json({ message: 'HighSchool Admission Average updated' });
      });
    });
  });
  
router.route('/scholarAndAwardCodes')
  .get(function(req, res) {
    console.log("Get request made to Scholar and Award Code");
    ScholarAndAwardCode.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All Scholar and Award Code data sent back");
        res.json({scholarAndAwardCode: data});
      }
    });
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new Scholar and Award Code");
      var a = new ScholarAndAwardCode(req.body.scholarAndAwardCode);
      console.log(req.body.scholarAndAwardCode);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new Scholar and Award Code has been posted");
          res.status(201).json({scholarAndAwardCode:a});
        }
      })
  });

router.route('/scholarAndAwardCodes/:scholarAndAwardCode_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific scholar and award code id");
      ScholarAndAwardCode.findById(req.params.scholarAndAwardCode_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific scholar and award code data sent back");
          res.json({scholarAndAwardCode: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a scholar and award code");
        ScholarAndAwardCode.remove({
            _id: req.params.scholarAndAwardCode_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Scholar and Award Code sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('scholarAndAwardCode_id being modified');
    ScholarAndAwardCode.findById(req.params.scholarAndAwardCode_id, function(err, scholarAndAwardCode) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.scholarAndAwardCode.name));
        scholarAndAwardCode.name = req.body.scholarAndAwardCode.name;  // update the bears info
        scholarAndAwardCode.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'ScholarAndAwardCode updated' });
      });
    });
  });

router.route('/secondarySchools')
  .get(function(req, res) {
    console.log("Get request made to Secondary School");
    SecondarySchool.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All Secondary School data sent back");
        res.json({secondarySchool: data});
      }
    });
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new Secondary School");
      var a = new SecondarySchool(req.body.secondarySchool);
      console.log(req.body.secondarySchool);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new Secondary School has been posted");
          res.status(201).json({secondarySchool:a});
        }
      })
  });
  
router.route('/secondarySchools/:secondarySchool_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific secondary school id");
      SecondarySchool.findById(req.params.secondarySchool_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific secondary school data sent back");
          res.json({secondarySchool: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a secondary school");
        SecondarySchool.remove({
            _id: req.params.secondarySchool_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Secondary School sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('secondarySchool_id being modified');
    SecondarySchool.findById(req.params.secondarySchool_id, function(err, secondarySchool) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.secondarySchool.name));
        secondarySchool.name = req.body.secondarySchool.name;  // update the bears info
        secondarySchool.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'SecondarySchool updated' });
      });
    });
  });

router.route('/highSchoolSubjects')
  .get(function(req, res) {
    console.log("Get request made to High School Subjects");
    HighSchoolSubject.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All highschool subjects data sent back");
        res.json({highSchoolSubject: data});
      }
    });
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new highschool subject");
      var a = new HighSchoolSubject(req.body.highSchoolSubject);
      console.log(req.body.highSchoolSubject);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new highschool subject has been posted");
          res.status(201).json({programRecord:a});
        }
      })
  });
  
router.route('/highSchoolSubjects/:highSchoolSubject_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific highschool subject id");
      HighSchoolSubject.findById(req.params.highSchoolSubject_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific highschool subject data sent back");
          res.json({highSchoolSubject: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a highschool subject");
        HighSchoolSubject.remove({
            _id: req.params.highSchoolSubject_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Highschool Subject sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('highSchoolSubject_id being modified');
    HighSchoolSubject.findById(req.params.highSchoolSubject_id, function(err, highSchoolSubject) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.highSchoolSubject.name));
        highSchoolSubject.name = req.body.highSchoolSubject.name;  // update the bears info
        highSchoolSubject.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'HighSchool Subject updated' });
      });
    });
  });
  
router.route('/highSchoolCoursesMarks')
  .get(function(req, res) {
    console.log("Get request made to High School Courses Mark");
    HighSchoolCoursesMark.find(function(err, data) {
      if (err){
        res.send(err);
        console.log("error");
        res.json({message: 'ERROR'});
      }
      else{
        console.log("All highschool courses mark data sent back");
        res.json({highSchoolCoursesMark: data});
      }
    });
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new highschool courses mark");
      var a = new HighSchoolCoursesMark(req.body.highSchoolCoursesMark);
      console.log(req.body.highSchoolCoursesMark);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new highschool courses mark has been posted");
          res.status(201).json({highSchoolCoursesMark:a});
        }
      })
  });
  
router.route('/highSchoolCoursesMarks/:highSchoolCoursesMark_id')
  .get(function(req, res) {
      console.log("A request has been made for a specific highschool courses mark id");
      HighSchoolCoursesMark.findById(req.params.highSchoolCoursesMark_id, function (error, data) {
        if (error) {
          console.log("Error");
          res.send({error: error});
        }
        else {
          console.log("Specific highschool courses mark data sent back");
          res.json({highSchoolCoursesMark: data});
        }
      });
  })
  .delete(function(req, res) {
    console.log("A request has been made to delete a highschool courses mark");
        HighSchoolCoursesMark.remove({
            _id: req.params.highSchoolCoursesMark_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("HighschoolCoursesMark sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('highSchoolCoursesMark_id being modified');
    HighSchoolCoursesMark.findById(req.params.highSchoolCoursesMark_id, function(err, highSchoolCoursesMark) {
        if (err){
            res.send(err);
        }
        console.log(JSON.stringify(req.body.highSchoolCoursesMark.name));
        highSchoolCoursesMark.name = req.body.highSchoolCoursesMark.name;  // update the bears info
        highSchoolCoursesMark.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?")
        res.json({ message: 'HighSchool CoursesMark updated' });
      });
    });
  });
  
router.route('/distributionResults')
  .get(function(req, res) {
    console.log("Get request made to DistributionResult");
    var StudentData= req.query.student;
    if(!StudentData)
    {
      DistributionResult.find(function(err, data) {
        if (err){
          res.send(err);
          console.log("error");
          res.json({message: 'ERROR'});
        }
        else{
          console.log("All DistributionResult data sent back");
          res.json({distributionResult: data});
        }
      });
    }
    else{
      console.log("Specific DistributionResult data requested");
      DistributionResult.findOne({"student": req.query.student}, function(error,data){
        if (error){
          res.send(error);
        }
        else{
          console.log("Specific DistributionResult data sent back");
          console.log(data);
          res.json({distributionResult:data});
        }
      });
    }
  })
  .post(function(req, res) {
      console.log("A request has been made to Post a new highschool courses mark");
      var a = new DistributionResult(req.body.distributionResult);
      console.log(req.body.distributionResult);
      
      a.save(function(error){
        if(error){
          console.log("posting error");
          res.send({error: error});
        }
        else{
          console.log("A new highschool courses mark has been posted");
          res.status(201).json({distributionResult:a});
        }
      })
  });
  
router.route('/distributionResults/:distributionResult_id')
  .delete(function(req, res) {
    console.log("A request has been made to delete a distribution result");
        DistributionResult.remove({
            _id: req.params.distributionResult_id
        }, function(err, bear) {
            if (err){
              console.log("Error");
              res.send(err);
            }
            console.log("Distribution result sucesfully deleted");
            res.json({ message: 'Successfully deleted' });
        });
    })
  .put(function(req, res){
    console.log('distributionResult being modified');
    DistributionResult.findById(req.params.distributionResult_id, function(err, distributionResult) {
        if (err){
            res.send(err);
        }
        distributionResult.date = req.body.distributionResult.date;  // update the bears info
        distributionResult.save(function(err) {
          if (err){
            res.send(err);
          }
        console.log("success?");
        res.json({ message: 'distributionResult updated' });
      });
    });
  });
  
app.use('', router);

app.listen(port);
console.log('AnyGoes development solutions preforms ordinary witchcraft on port ' + port);