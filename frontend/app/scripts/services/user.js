'use strict';

/**
 * @ngdoc service
 * @name frontendApp.user
 * @description
 * # user
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .factory('user', function (CONFIG, $http, $q, notification) {
   return {

        register: function(user) {
          delete user.confirmPassword;
           var deferred = $q.defer();
           $http.post(CONFIG.baseUrlApi + '/register', user)
             .success(function(data) {
               notification.writeNotification(data);
               deferred.resolve(data);
             }).error(function(data) {
               notification.writeNotification(data);
               deferred.reject(false);
             });
           return deferred.promise;
         },

        logIn: function(user) {
          var deferred = $q.defer();
          $http.post(CONFIG.baseUrlApi + '/login', user)
            .success(function(data) {
              notification.writeNotification(data);
              deferred.resolve(data);
            }).error(function(data) {
              notification.writeNotification(data);
              deferred.reject(false);
            });
          return deferred.promise;

        },

        test: function() {
           var deferred = $q.defer();
           $http.post(CONFIG.baseUrlApi + '/test', {user: 'lol'})
             .success(function(data) {
              console.log(data);
               notification.writeNotification(data);
               deferred.resolve(data);
             }).error(function(data) {
               notification.writeNotification(data);
               deferred.reject(false);
             });
           return deferred.promise;
         },

      };
});

