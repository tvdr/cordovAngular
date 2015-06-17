myApp.directive('validNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return; 
      }
      
      ngModelCtrl.$parsers.push(function(val) {
        var clean = val.replace( /[^0-9]+/g, '');
        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });
      
      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});

myApp.directive('vibrate', function() {
  return {
    restrict: 'A',  
    link: function (scope, element, attr) {
      
      element.bind('click', function(event,attrs) {
        navigator.notification.vibrate(50);
        //console.log('vibrate');
      });
    }
  };
});
