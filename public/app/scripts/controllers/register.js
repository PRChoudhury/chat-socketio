'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('RegisterCtrl', function ($scope,$rootScope,$http,$location,$timeout) {
  
  	$rootScope.success_msg = false;

   	this.registerUser = function(user){
   		$rootScope.error_msg = false;
	   	$rootScope.success_msg = false;
	   	console.log("reg button");
	   	console.log(this.user);
		this.user.imageProfile = "emptyPic.jpg";
		$http.post('/api/register',this.user)
		.then(function(response){

		//	console.log(response.data);
			
			if(response.data['success']){
				
				$scope.success_msg =response.data['message']+"...Redirecting to Login page";
				$timeout(function() {

						$location.path('/');
				}, 3000);
				
			}else{

					$scope.error_msg =response.data['message'];
				}	
		});
			

	}
});
