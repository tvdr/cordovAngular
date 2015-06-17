//configure our module
myApp = angular.module('myApp', [
  'ngRoute',
  'base64',
  'ngCordova',
  'myAppServices',
  'myAppControllers',
]);

myApp.config(['$routeProvider', '$locationProvider', function($routeProvider,$locationProvider) {
  //declare our routes
  $routeProvider.
  when('/splash',{
      templateUrl:'partials/splashscreen.html',
      controller: 'splashScreenController'
  }).
  when('/lang_select',{
      templateUrl:'partials/lang_select.html',
      controller: 'langSelectController'
  }).
  otherwise({
    redirectTo: '/splash'
  });
}]);


myApp.run(function($rootScope,FileService,$location,LogService,PrintService){
    
    
});


