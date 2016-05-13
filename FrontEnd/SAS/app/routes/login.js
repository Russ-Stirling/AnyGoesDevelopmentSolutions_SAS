import Ember from 'ember';


export default Ember.Route.extend({
  renderTemplate: function () {
    if (this.get('oudaAuth').get('isAuthenticated')) { //This is to disable the effect of back button in the browser
    console.log('am i here');
 //     location.replace(location.origin+'/home');
      this.get('oudaAuth').close();
      this.render('login', {  // the template to render
       into: 'application' ,  // the template to render into
        outlet: 'login'
      });
    }
    else {
      console.log('or maybe here');
      this.render('login', {  // the template to render
        into: 'application' ,  // the template to render into
        outlet: 'login'
      });
    }
  }
});


