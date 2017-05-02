'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the publicApp
 */
var app = angular.module('publicApp');

app.service('sharedContactList' ,function(){
	this.allContacts = {};

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

app.factory("todoRepo" , function($http,$rootScope,$q,$window){

	var def =$q.defer();

	var token = $window.localStorage.getItem('token');
	var url = "/api/contactlist/" + token;

	$http.get(url).then(function(data){
		def.resolve(data)

	});

	return def.promise;
});



app.service('multipartForm',['$http',function($http,$rootScope,$scope){

this.post = function(uploadUrl,data,user){
	//console.log(data);
	//console.log(user);

	var fd = new FormData();
	fd.append('file',data);
	fd.append('login',user);
	for(var key in data)
		fd.append(key,data[key]);
	return $http.post(uploadUrl,fd,{

		transfromRequest:angular.identity,
		headers:{'Content-Type':undefined }
	});
}

}]);
app.controller('MainCtrl', function ($http,$scope,$rootScope,todoRepo,multipartForm,sharedContactList,profileId) {
 	var app = this;
 	$scope.contactfilter={};
	todoRepo.then(function(data){
		
		sharedContactList.allContacts = data.data;
		app.contactlist = sharedContactList.allContacts;
		//console.log(sharedContactList.allContacts);
		$scope.$watch(function () { return sharedContactList.allContacts }, function (value) {
        	$scope.contactlist = value;
        //	console.log(sharedContactList.allContacts);
    	});
		//console.log(app.contactlist.length);
		if(app.contactlist.length == 0){

			app.displayNone = true;
			app.nodata = "Contacts not available.";
		}
		$scope.$watch('main.search.name',function(){

		 	$scope.contactlist =$scope.contactfilter ;
		 	app.selectContact();
		 
		 });


	});

	

	app.selectContact = function(contact,index){
		app.editmode = false;
		app.error_msg = false;
		app.success_msg = false;
		app.index = index;
		//console.log(app.index);
		//console.log(contact);
		
		(typeof(contact) == 'object')?app.contact=contact:app.contact=$scope.contactfilter[0];
		//console.log(app.contact);
	}

	app.submit = function(){

	var uploadUrl = "/api/uploads/"+app.contact._id;
	var file = angular.element(document.querySelector('#file')).prop("files")[0];
	var loginID = profileId.curId;
	multipartForm.post(uploadUrl,file,loginID).then(function(response){

		app.contactlist=response.data;
		
		$scope.$watch('contact',function(){

		 	app.contact = $scope.contactfilter[app.index];
		
		 
		 });
	
		$('#imgModal').modal('hide');

	});


	}
	
	app.toggleEditMode = function(){

			app.editmode = true;
			app.error_msg = false;
			app.success_msg = false;
		}
	app.editContact = function(contact){
			//console.log(app.contact._id);
			app.editmode = false;
			app.editmode = false;
			app.error_msg = false;
			app.success_msg = false;
			if(!$scope.editForm.$pristine){
		 
			var url = '/api/contactlist/'+ app.contact._id;
			$http.put(url , app.contact).then(function(data){
			if(data.data.success){
				sharedContactList.allContacts = data.data.docs;
				app.success_msg = data.data.message;
			}else{

				app.error_msg = "Could not update contact due to internal error."
			}
			});
		}else{
				app.error_msg="Contact details remain unchanged.";
		}


	}
		
	app.smsError = function(){

		app.error_msg = "Cannot send SMS to alternate number.";
	}


	app.sendEmail = function(email,contact){

		console.log(this.email,this.contact.email);

		var url = '/api/sendemail/'+this.contact.email;
		$http.post(url,this.email).then(function(data){
			if(data.data.success){
				app.email.sub=app.email.body='';
				$('#emailModal').modal('hide');
				app.success_msg = data.data.message;


			}else{

				app.error_msg = "Sorry ! could not sent email.";
							}
			
		});
	}

	app.sendSMS = function(contact){
		app.sentMessage = false;
		var contactnum = app.contact.number;
		console.log(contactnum);
		var url = '/api/testtwilio/'+contactnum;
		$http.post(url ,app.contact).then(function(data){
				app.contact.sms = '';
				app.sentMessage = true;

		});

	}

	app.changePassword = function(user){
		app.success_msg = false;
		app.error_msg = false;
		//console.log(this.user);
		var url  = '/api/changepass/'+ profileId.curId;
		$http.put(url,app.user).then(function(data){
			if(data.data.success){
				app.success_msg = data.data.message;
			}else{
				app.error_msg = data.data.message;
			}

		});
	}

});



