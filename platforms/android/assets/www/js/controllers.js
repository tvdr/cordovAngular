myAppControllers = angular.module('myAppControllers',['myAppServices','ngCordova'])

myAppControllers.controller('splashScreenController',['$scope','$http','$location','$rootScope','FileService','PrintService','$filter', function($scope,$http,$location,$rootScope,FileService,PrintService,$filter){
    $.material.init();
    
    console.log('splash');
    
    document.addEventListener('deviceready', function () {
        
        $location.path('/lang_select');
        $scope.$apply(); //miért kell ez ide? nemtudom
    })
}]);

myAppControllers.controller('langSelectController',['$location','$scope','$rootScope', function($location,$scope,$rootScope){
        
    $scope.setLang = function(lang){
        $rootScope.lang = language[lang];
        $location.path('/login');
    } 
        
    
}]);