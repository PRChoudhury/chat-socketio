'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('EmailCtrl', function ($routeparams,authToken) {

  //	$http.put('/api/activate/'+token);
  authToken.activeAccount($routeparams.token).then(function(data){

  	console.log(data);
  	});
    
  });
