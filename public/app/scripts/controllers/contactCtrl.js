'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the publicApp
 */
var app =angular.module('publicApp');




app.controller('ContactCtrl', function ($q,$http,$scope,$rootScope,authToken,$timeout,$location,todoRepo,$window,sharedContactList) {
   		
  	var app = this;
	  	

  	app.addNew = function(user,valid){
  		app.error_msg = false;
  		app.success_msg= false;
  		app.disabled = true;
  		
  		if(valid) {
  				var token = $window.localStorage.getItem('token');
  				var url = '/api/contactlist/'+token;
  				var def= $q.defer();
  				$http.post(url, app.user).then(function(data){

  						if(data.data.success){
  							console.log(data.data.user);
  							app.success_msg = data.data.message;
  							sharedContactList.allContacts.push(data.data.user[data.data.user.length-1]);
  						}else{

  							app.error_msg  =data.data.message;
  							//$scope.contactForm.$setPristine();
  							app.disabled=false;
  						}
  				});
  				
  	
  		
  			
  			

  		}else{

  			app.error_msg = "Please ensure form is filled out correctly.";
  		}

  }

});