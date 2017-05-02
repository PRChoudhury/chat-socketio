'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the publicApp
 */

 var app = angular.module('publicApp');
 app.service('profileId',function(){

 		this.curId = {};
 });

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

 	authTokenFactory.facebook = function(token){

 		return authTokenFactory.setToken(token);
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

app.directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.regForm.upass.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
});

//angular.module('publicApp')
  app.controller('LoginCtrl', function ($http,$scope,$rootScope,$timeout,$location,authToken,$window,profileId) {
 
 	var app =this;
 	app.dispNav = false;
 	$rootScope.$on('$routeChangeStart',function(){
 		$scope.error_msg = false;
 		$scope.success_msg=false;
 		if(authToken.isLoggedIn()){

   		console.log("logged in");
   		app.loggedIn = true;
   		app.dispNav =true;
   		authToken.getUser().then(function(data){
   			profileId.curId = data.data.email;
   		//	console.log(data.data.username);
   		app.username =data.data.username;
   			});
  		}else{
  			app.loggedIn = false;
   	   		console.log("NOT Logged in");
   	   		app.username='';
   	   		app.dispNav =true;
   }
   		if($location.hash() == "_=_") $location.hash(null);
 	});
   
 	app.facebook = function(){

 		// console.log($window.location.host);
 		// console.log($window.location.protocol);
 		$window.location = $window.location.protocol + '//'+$window.location.host + '/auth/facebook';

 	}

 	app.google = function(){

 		// console.log($window.location.host);
 		// console.log($window.location.protocol);
 		$window.location = $window.location.protocol + '//'+$window.location.host + '/auth/google';

 	}

  	app.loginUser = function(log){
	//e.preventDefault();
	//console.log(this.log.username+"--------using this");
	//console.log($scope.log.username +"------using scope");
	$http.post('/api/authenticate',this.log)
	.then(function(response){
	//	console.log(response.data);
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



  })

app.controller('facebookCtrl' ,function($http,$location,$scope,authToken,$routeParams,$window){
	var app = this;
	if($window.location.pathname == '/facebookerror'){

		$scope.error_msg = "Facebook account not found.";
	}else{
		var token = $routeParams.token
		authToken.facebook(token);
		$location.path('/home');
	}
})


app.controller('googleCtrl' ,function($http,$location,$scope,authToken,$routeParams,$window){
	var app = this;
	if($window.location.pathname == '/googleerror'){

		$scope.error_msg = "Google account not found.";
	}else{
		var token = $routeParams.token
		authToken.facebook(token);
		$location.path('/home');
	}
})
