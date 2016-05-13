import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('genders');
  this.route('locations');
  this.route('academicLoads');
  this.route('residencies');
  this.route('itrPrograms');
  this.route('academicProgramCodes');
  this.route('faculties');
  this.route('termCodes');
  this.route('degreeCodes');
  this.route('courseCodes');
  this.route('programAdministrations');
  this.route('departments');
  this.route('admissionRules');
  this.route('students');

  this.route('student', {path: 'students/:student_id'});

  this.route('adminPortal');
  this.route('login');
  this.route('user');


  this.route('distributionResults');
  this.route('uploadFiles');
  this.route('ScholarAndAwardCodes');
  this.route('secondarySchools');
  this.route('highschoolCoursesMarks');
  this.route('highschoolSubjects');
  this.route('highschoolAdmissionAverages');
  this.route('basisOfAdmissions');
  this.route('basisOfAdmissionCodes');
});

export default Router;