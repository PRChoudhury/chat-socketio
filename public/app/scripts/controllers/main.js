'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the publicApp
 */
angular.module('publicApp').factory("todoRepo" , function($http,$rootScope,$q){

	var def =$q.defer();
	var url = "/api/contactlist";
	$http.get(url).then(function(data){
		def.resolve(data)

	});
	return def.promise;
});

var paginationSettings ={

	usePagination:true,
	pageLimit:5

};

angular.module('publicApp').service('multipartForm',['$http',function($http,$rootScope,$scope){

this.post = function(uploadUrl,data,user){
	//console.log(data.id);
	var fd = new FormData();
	for(var key in data)
		fd.append(key,data[key]);
	return $http.post(uploadUrl,fd,{

		transfromRequest:angular.identity,
		headers:{'Content-Type':undefined }
	});
}

}]);
angular.module('publicApp').controller('MainCtrl', function ($http,$scope,$rootScope,todoRepo,multipartForm) {
    var app = this;


    $scope.test = "testing from main controller";

todoRepo.then(function(response){

$rootScope.contactlist=response.data;
console.log(response.data);
$scope.begin = 0;
$rootScope.curPage =1;
if(paginationSettings.usePagination){
	$scope.end=paginationSettings.pageLimit;

}else{
	$scope.showPg = true;
	$scope.end=$rootScope.contactlist.length;
	$rootScope.contactlist = response.data.slice(0, 10);

}
$rootScope.totalPgs;
$rootScope.indexPages;
$rootScope.selectedUser;
var pages;
console.log("got requested data");



$scope.getMoreData = function() {
    $rootScope.contactlist = response.data.slice(0, $rootScope.contactlist.length + 2);
}



	$scope.$watch(function () {
	//	($scope.fsearch == "")?null : $scope.fsearch;
    	$rootScope.contactfilter = $scope.$eval("contactlist | filter:fsearch |orderBy:'name'");
    	//$rootScope.contactfilter.length;
    //	($rootScope.contactlist == "")?response.data:$scope.$eval("contactlist | filter:fsearch");
    	$rootScope.indexPages=new Array();
		$rootScope.totalPgs = Math.ceil($rootScope.contactfilter.length/$scope.end);
		for(pages =0;pages<$rootScope.totalPgs;pages++){
			$rootScope.indexPages.push(pages+1);
		//$scope.$digest();
	}
	});

	$rootScope.contact={};
	
	//console.log($scope.contactlist.length);



});

$scope.selectUserDetails = function(uid , name,number){
	$scope.sentMessage=false;
	$rootScope.userName = name;
	$rootScope.userNumber = number;
	$rootScope.selectedUser = uid;
}

$scope.submit = function(){

	var uploadUrl = "/api/uploads/"+$rootScope.selectedUser;
	multipartForm.post(uploadUrl,$scope.contact,$rootScope.selectedUser).then(function(response){
		$rootScope.contactlist=response.data;
		$('#myModal').modal('hide');

	});

	//refresh();
};

$scope.showCurPage = function(id){
	$rootScope.curPage = id;
//	console.log($rootScope.totalPgs);
//	console.log($rootScope.curPage);
	$scope.begin = ((id-1)*5); 
	//console.log($scope.begin);
}
	
//refresh();	
	



var checkContact = function(){
	var curName = $scope.contact.name;
	var curEmail = $scope.contact.email;
	var curNumber = $scope.contact.number;
	$scope.contact['imageProfile'] = "emptyPic.jpg";
	$http.post('/contactlist',$scope.contact).then(function(response){
	//console.log(response.data.length+"--------------->");
			$scope.contact={};
//console.log(response.data[0].name);
//console.log(curName);
			if(response.data[0].number == curNumber){
				//console.log(response.data[0]);
				//alert("Number already exists.");
				$scope.showErr = false;
				$scope.msgError = "Number already exists.";
				return false;
			}else if(response.data[0].name == curName){
				$scope.showErr = false;
				$scope.msgError = "Name already exists.";
				return false;

			}else if(response.data[0].email == curEmail){
				$scope.showErr = false;
				$scope.msgError = "Email already exists.";
				return false;
			}

			$rootScope.contactlist=response.data;

			
			
	});

}	

$scope.checkLoginState = function() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

$scope.sendSMS = function(){

	var id  = $rootScope.userNumber;
	$http({

		url : '/api/testtwilio/'+id,
		data : $scope.contact,
		method : "POST"

		}).then(function(response){
			$scope.contact={};
			$scope.sentMessage = true;
		//console.log(response.data);
		//if(err)
		//	console.log(err);
	
});

}

$scope.addContact = function(){

	$scope.contact.imageProfile = "emptyPic.jpg";
	$scope.showErr = true;
	checkContact();	
	

	
}

$scope.delContact = function(id){

	var msg= "Are you sure you want to delete this contact?";
	var conf = confirm(msg);
	if(!conf){

		return fasle;
	}else{

		$http.delete('/contactlist/'+id).then(function(response){

			$scope.contact={};
			$rootScope.contactlist=response.data;
			$rootScope.totalPgs = Math.ceil($scope.contactlist.length/$scope.end);
			//$scope.begin($rootScope.totalPgs);
			//refresh();
			$scope.showCurPage($scope.totalPgs);

		});
	}

}

$scope.editContact = function(id){
	$scope.updtbtn =true;

	//console.log(id);

	$http({

	method :"GET",
	url : "/contactlist/"+id
}).then(function(response){

	//console.log("got requested data");

	$scope.contact=response.data;
	//$scope.contact={};
	//console.log(response);
});
}

$scope.updateContact =  function(){

	console.log($scope.contact._id);
	$http.put('/contactlist/'+$scope.contact._id,$scope.contact).then(function(response){
		console.log(response);
		$scope.contact={};
		$rootScope.contactlist=response.data;
		$scope.updtbtn =false;

	});
}

$scope.Cancel = function(){
	$scope.contact={};
	$scope.updtbtn =false;
}

$scope.showMore = function(){

	$scope.lmt=$scope.lmt+2;

}

  });
