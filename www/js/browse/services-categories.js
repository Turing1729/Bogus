angular.module('starter.services-categories', [])

.factory('Categories', function(FireFunc) {
  var self = this;
  self.get = function() {
    return FireFunc.onValue('settings/categories').then(function(Categories){
      self.all = Categories;
    })
  };
  return self;
})

.factory('Settings_Fees', function(FireFunc) {
  var self = this;
  self.get = function() {
    return FireFunc.onValue('settings/fees');
  };
  return self;
});
