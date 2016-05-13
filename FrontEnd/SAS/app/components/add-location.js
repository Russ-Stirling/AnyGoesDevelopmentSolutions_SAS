import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  cityAdding: true,
  newCountryCode: false,
  noCountry: false,
  newProvinceCode: false,
  noProvince:false,
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),
  country: null,
  
  countriesModel: Ember.computed('isEditing', function(){
    return this.get('store').findAll('country');
    
  }),
    
  provincesModel: Ember.computed('noCountry', function(){
    console.log('In getting provinces');
    return this.get('store').query('province', {country: this.get('country')});
    
  }),
  citiesModel: Ember.computed('noProvince', function(){
    console.log('In getting cities');
    return this.get('store').query('city', {province: this.get('province')});

  }),
    
  actions: {
    selectCountry(country){
      this.set('country', country);
      this.set('countryName', country);
      this.set('noCountry', false);
      this.set('noProvince', false);
      this.set('noCountry', true);
      this.set('newProvinceCode', false);
      //this.set('newCountryCode', false);
      //var co = this.get('store').peekRecord('country', this.get('country'));
     //this.set('countryName', co.get('name'));
      
    },
    selectProvince(province){
      this.set('province', province);
      this.set('noProvince', false);
      //this.set('newProvinceCode', false);
      this.set('noProvince', true);
      //var pr = this.get('store').peekRecord('province', this.get('province'));
      //this.set('provinceName', pr.get('name'));
      
    },

    saveCode: function () {
      var myStore = this.get('store');
      var newCode;
      var pr = myStore.peekRecord('province', this.get('province'));
      console.log(this.get('province'));
      console.log(this.get('city'));
      newCode = myStore.createRecord('city', {
        name: this.get('city')
      });
      pr.get('cities').pushObject(newCode);
      var frame=this;
      newCode.save().then(function(){
        frame.set('city', null);
        frame.set('noProvince', false);
        frame.set('noProvince', true);
      });

    },
    
    saveProvince: function() {
      var myStore = this.get('store');
      var co = myStore.peekRecord('country', this.get('country'));
      console.log(this.get('country'));
      console.log(this.get('province'));
      var newCode = myStore.createRecord('province', {
        name: this.get('province')
      });
      co.get('provinces').pushObject(newCode);
      var frame=this;
      newCode.save().then(function(){
        frame.set('province', null);
        frame.set('noCountry', false);
        frame.set('noCountry', true);
        frame.set('noProvince', false);
        frame.set('newProvinceCode', false);
      });

    },
    
    saveCountry: function() {
      var myStore = this.get('store');
      console.log(this.get('country'));
      var newCode = myStore.createRecord('country', {
        name: this.get('country')
      });
      var frame = this;
      newCode.save().then(function(){
        frame.set('newCountryCode', false);
        frame.set('country', null);
      });
    },
    
    addNewProvinceCode: function() {
      this.set('province', null);
      this.set('newProvinceCode', true);
      this.set('noProvince', false);

    },
    
    addNewCountryCode: function() {
      this.set('country', null);
      this.set('newCountryCode', true);
      this.set('noCountry', false);
      this.set('noProvince', false);
    },

    addNewCode: function () {
      this.set('isEditing', true);
    },

    cancel: function () {
      this.set('isEditing', false);
      this.set('newCountryCode', false);
      this.set('newProvinceCode', false);
      this.set('noCountry', true);
      this.set('noProvince', true);
      this.set('country', null);
      this.set('province', null);
      this.set('city', null);
      this.get('routing').transitionTo('home');

    },
    deleteCityCode: function(id) {
            console.log(id);
            var myStore = this.get('store');
            
            var genderData = myStore.peekRecord('city', id); //Can only peek at records if record has been already loaded to the page
            console.log(genderData.get('name'));
            
            genderData.deleteRecord(); // Deletes record locally
            genderData.save(); // Saves changes to database
    },
    deleteCountryCode: function(id) {
            this.set('noCountry', false);
            this.set('noProvince', false);
            console.log(id);
            var myStore = this.get('store');
            
            var genderData = myStore.peekRecord('country', id); //Can only peek at records if record has been already loaded to the page
            console.log(genderData.get('name'));
            
            genderData.deleteRecord(); // Deletes record locally
            genderData.save(); // Saves changes to database
    },
    deleteProvinceCode: function(id) {
            this.set('noProvince', false);
            console.log(id);
            var myStore = this.get('store');
            
            var genderData = myStore.peekRecord('province', id); //Can only peek at records if record has been already loaded to the page
            console.log(genderData.get('name'));
            
            genderData.deleteRecord(); // Deletes record locally
            genderData.save(); // Saves changes to database
    }
  }
});
