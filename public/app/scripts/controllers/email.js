'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the publicApp
 */
var app = angular.module('publicApp');

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

  app.controller('EmailCtrl', function($http,$scope,$routeParams,$timeout,$location) {
  	//$scope.testmsg = "Testing route ";
  		var token  = $routeParams.token;
  		app = this;
  		//console.log(token+"----------->from controller");
  		$http.put('/api/activate/'+token).then(function(data){

  				app.success_msg =false;
  				app.error_msg =false;
  				if(data.data.success){
  					//console.log(data.data.message);
  					app.success_msg = data.data.message + "...Redirecting";
  					$timeout(function() {
  						$location.path('/');
  					}, 2000);
  				}else{

  					app.error_msg = data.data.message;
  				}
  		});
  	})
//angular.module('publicApp')
  app.controller('UsernameCtrl' ,function($routeParams,$http,$scope){
  	var email  = $routeParams.email;
  	var app = this;

  	app.submitEmail =  function(userData,valid){
  	if(valid){
	$http.get('/api/resetusername/' + this.userData.useremail).then(function(data){
			app.success_msg =false;
  			app.error_msg =false;
  			if(data.data.success){

  				app.success_msg = data.data.message;
  				app.userData.useremail = '';
  			}else{

  				app.error_msg = data.data.message;
  				app.userData.useremail = '';
  			}
  		});
}	else{

	app.error_msg = 'Please enter a valid email.';
}
  	}

  })

  app.controller('PasswordCtrl' ,function($http){

  	var app = this;

 	app.submitUsername =  function(userData,valid){
  	if(valid){
	$http.put('/api/resetuserpass/' +this.userData.username).then(function(data){
			app.success_msg =false;
  			app.error_msg =false;
  			if(data.data.success){

  				app.success_msg = data.data.message;
  				app.userData.username = '';
  			}else{

  				app.error_msg = data.data.message;
  				app.userData.username = '';
  			}
  		});
}	else{

	app.error_msg = 'Please enter a valid email.';
}
  	}


  })

    app.controller('ResetCtrl' ,function($http,$routeParams,$scope,$location,$timeout){

    var token  = $routeParams.token;
  	var app = this;
	app.hide= true;
	$http.get('/api/resetuserpass/' + token ).then(function(data){
	//	console.log(data);
		if(data.data.success)		{
			app.hide=false;
			$scope.username = data.data.user.name;
			//console.log($scope.username);

		}else{
			app.error_msg='Password reset link has been expired.';
		}
	});

	app.savePassword = function(user){
		app.user.username = $scope.username;
		//console.log(this.user+"--------->consoleLog");
		$http.put('/api/saveNewPass' , this.user).then(function(data){

				if(data.data.success){
					app.success_msg = data.data.message + '...Redirecting';
					$timeout(function() {
						$location.path('/');
					}, 2000);
				}else{
					app.error_msg = data.data.message;
				}
		});
	}


});