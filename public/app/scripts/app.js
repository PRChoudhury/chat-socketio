'use strict';

/**
 * @ngdoc overview
 * @name publicApp
 * @description
 * # publicApp
 *
 * Main module of the application.
 */
var app = angular.module('publicApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
    
  ])
  .config(function ($routeProvider,$locationProvider,$httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
    $locationProvider.hashPrefix('');
    $routeProvider
      .when('/', {
        //console.log(token);
        templateUrl: 'views/login.html',
        authenticated : false
       
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact'
      })
      .when('/activate/:token', {
        templateUrl : 'views/activate.html',
        controller : 'EmailCtrl',
        controllerAs: 'email'
       // authenticated : false
      })
      .when('/home', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        authenticated : true
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register',
        authenticated : false
        })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        authenticated : true
       
        })
      .when('/authUsername' , {
          templateUrl : 'views/authUsername.html',
          controller : 'UsernameCtrl',
          controllerAs : 'username'

      })
      .when('/authPassword' , {
        templateUrl :'views/authPassword.html',
        controller : 'PasswordCtrl',
        controllerAs : 'password'

      })
      .when('/reset/:token' ,{
        templateUrl : 'views/passReset.html',
        controller  : 'ResetCtrl',
        controllerAs: 'reset', 

      })
      .when('/facebook/:token' ,{
        templateUrl : 'views/social.html',
        controller  : 'facebookCtrl',
        controllerAs :'facebook'
      })
      .when('/facebookerror' , {

        templateUrl :'views/login.html',
        controller :'facebookCtrl',
        controllerAs :'facebook'

      })
        .when('/google/:token' ,{
        templateUrl : 'views/social.html',
        controller  : 'googleCtrl',
        controllerAs :'google'
      })
      .when('/googleerror' , {

        templateUrl :'views/login.html',
        controller :'googleCtrl',
        controllerAs :'google'

      })
      .when('/settings' , {
        templateUrl : 'views/settings.html',
        controller : 'MainCtrl',
        controllerAs:'main'

      })
       .when('/about' , {
        templateUrl : 'views/about.html'
       })
      .otherwise({
        redirectTo: '/'
      });
       $locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});
  });

app.run(['$rootScope', 'authToken', '$location', function($rootScope,authToken,$location){

  $rootScope.$on('$routeChangeStart' ,function(event,next,current){
    if(next.$$route !== undefined) {
      if(next.$$route.authenticated == true){
          if(!authToken.isLoggedIn()){
              event.preventDefault();
              $location.path('/');
          }

      }else if(next.$$route.authenticated == false){
          if(authToken.isLoggedIn()){
              event.preventDefault();
              $location.path('/home');

          }

      }
    }

  });

}]);

app.controller('headerCtrl',function($scope,$location){

    $scope.isActive = function (viewLocation) { 

        return viewLocation === $location.path();
    };


});