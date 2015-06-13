angular.module('contact-complete', [])
.directive('contactComplete', function($ionicTemplateLoader, $document, $sce) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, element, attrs, ngModel) {

      var lastSelectedValue=null;

      // do nothing if the model is not set
      if (!ngModel) return;


      scope.contactCompleteTransfer=function(item) {
        // transfer selected value to the input
        ngModel.$setViewValue(item);
        ngModel.$render();

        // hide the list
        lastSelectedValue=item;
        scope.contactComplete={
          items: []
        };
      }

      var template=[
        '<ion-list ng-show="contactComplete.items.length">',
        ' <ion-item ng-repeat="item in contactComplete.items track by $index" href="#" ng-click="contactCompleteTransfer(item.value)">',
        '    <p ng-bind-html=item.display>{{item.display}}</p>',
        ' </ion-item>',
        '</ion-list>'
      ].join('');

      $ionicTemplateLoader.compile({
                    template: template,
                    scope: scope

      }).then(function(compiledTemplate) {
        var container=null;
        if (attrs.contactCompleteContainer) {
          container=angular.element(document.getElementById(attrs.contactCompleteContainer));
          container.addClass('contact-complete-container');
        } else {
          container=angular.element('<div class="contact-complete-container" />');
          element.after(container);
        }
        container.append(compiledTemplate.element);
      });

      scope.$watch(attrs.ngModel, function(value) {
        if (value && value!=lastSelectedValue && angular.isFunction(scope[attrs.contactCompleteCallback])) {
          scope[attrs.contactCompleteCallback](value).then(function(result) {
            if (typeof(result)=='array' || typeof(result)=='object') {


              // highlight the matching parts
              for (var x in result) {
                var re=new RegExp('(' + value + ')', 'ig');
                result[x].display=$sce.trustAsHtml(result[x].display.replace(re, '<b>$&</b>'));
              }

              scope.contactComplete={
                items: result
              };
            }
          });

        } else {
          scope.contactComplete={
            items: []
          };
        }
      });
    }
  };
});
