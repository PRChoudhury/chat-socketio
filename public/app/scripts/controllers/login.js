'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the publicApp
 */

 var app = angular.module('publicApp');
 app.factory('authToken' ,function($window,$http,$q){

 	var authTokenFactory = {};

 	authTokenFactory.setToken = function(token){
 		if(token){
 			$window.localStorage.setItem('token',token);
 		}else{
 			$window.localStorage.removeItem('token');
 		}
 	};

	authTokenFactory.getToken = function(){
 			return $window.localStorage.getItem('token');
 	};

	authTokenFactory.isLoggedIn = function(){
		if(this.getToken()){
		return true;
			}else{
		return false;
		}

	};

	authTokenFactory.getUser = function(){
		if(this.getToken()){
			return $http.post('/api/me');
		}else{
			$q.reject({message:"User has no token"});
		}

	};

	authTokenFactory.logout = function(){

		this.setToken();
	}

	authTokenFactory.activeAccount = function(token){

		return $http.put('/api/activate/' + token);
	}


 	return authTokenFactory;
 });
//angular.module('publicApp')
app.factory('AuthInterceptor', function($window){

		var authInterceptorFactory = {};

		authInterceptorFactory.request = function(config){
			var token = $window.localStorage.getItem('token');
			if(token) config.headers['x-access-token'] = token;

			return config;
		}

		return authInterceptorFactory;

});

//angular.module('publicApp')
  app.controller('LoginCtrl', function ($http,$scope,$rootScope,$timeout,$location,authToken) {
 
 	var app =this;
 	$rootScope.$on('$routeChangeStart',function(){
 		$scope.error_msg = false;
 		$scope.success_msg=false;
 		if(authToken.isLoggedIn()){

   		console.log("logged in");
   		app.loggedIn = true;
   		authToken.getUser().then(function(data){

   		//	console.log(data.data.username);
   		app.username = data.data.username;
   			});
  		}else{
  			app.loggedIn = false;
   	   		console.log("NOT Logged in");
   	   		app.username='';
   }

 	});
   
  	app.loginUser = function(log){
	//e.preventDefault();
	console.log(this.log.username+"--------using this");
	//console.log($scope.log.username +"------using scope");
	$http.post('/api/authenticate',this.log)
	.then(function(response){
		console.log(response.data);
		if(response.data.message){

			$scope.error_msg = response.data['message'];
		}else{
			//$rootScope.usererror =false;
			//$scope.currentUser = response.data;
			authToken.setToken(response.data);
			$timeout(function() {
					$location.url('/home');
					app.log='';

			}, 2000);
			
		}
	
		
	});

}

	this.logout = function(){
		authToken.logout();
		$location.path('/api/logout');
		$timeout(function() {
			$location.path('/');
		}, 2000);
	};



  });
