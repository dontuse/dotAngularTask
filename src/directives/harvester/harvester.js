import template from './harvester.html';

// What the hell are you doing Angular ? please stop !
export default ngModule => {
    ngModule.directive('harvester', function ($document) {
        return {
            restrict: 'E',
            replace: 'true',
            template: template,
            scope: {
                mix: '@',
                mod: '@',
                time: '=',
                fruits: '=',
                months: '=',
                totalWeight: '=',
                filter: "=",
                activeMonth: "="
            },
            controller: function () {
                console.log('control');
            },
            link: function (scope, element, attrs) {

                scope.dropDownIsOpen = false;
                scope.currentPage = 0;
                scope.itemsPerPage = 4;
                scope.canPrev = false;
                scope.canNext = false;

                scope.$watch('fruits', function (val) {
                    scope.currentPage = 0;
                    paginate();
                });

                $document.on('click', function(e){
                    e.stopPropagation();
                    scope.dropDownIsOpen = false;
                    scope.$apply();
                });

                scope.openDropDown = function (e) {
                    e.stopPropagation();
                    scope.dropDownIsOpen = !scope.dropDownIsOpen;
                };
                scope.selectTime = function (month, val) {
                    scope.filter(month);
                };


                scope.startingItem = function () {
                    return scope.currentPage * scope.itemsPerPage;
                };

                scope.next = function (e) {
                    scope.currentPage = scope.currentPage + 1;
                    paginate();
                };

                scope.prev = function () {
                    scope.currentPage = scope.currentPage - 1;
                    paginate();
                };

                function paginate() {
                    let numberOfpages = Math.ceil(scope.fruits.length / scope.itemsPerPage);
                    if (scope.fruits.length > scope.itemsPerPage) {
                        scope.canNext = (scope.currentPage == 0);
                        scope.canPrev = (scope.currentPage == Math.ceil(numberOfpages - 1));
                        scope.pFruits = scope.fruits.slice(scope.currentPage * scope.itemsPerPage);
                    }
                    else {
                        scope.pFruits = scope.fruits;
                        scope.canNext = false;
                        scope.canPrev = false;
                    }
                }

            }
        };
    });
}

