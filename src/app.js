import './styles/index.less';
import angular from 'angular';
import harvester from './directives/harvester/harvester.js';
import harvestStore from './stores/harvestStore.js';
import harvestActions from './actions/harvesterActions.js';
import ngAnimate from 'angular-animate';

let harvesterModule = angular.module('app', [ngAnimate]);


class HarvesterController {
    constructor() {
        this.fruits = harvestStore.getFruits();
        this.months = harvestStore.getMonths();
        this.totalWeight = harvestStore.getTotalWeight();
        this.activeMonth = harvestStore.getActiveMonth();
    }

    filterByMonth = (month) => {
        harvestActions.filterByMonth(month);
        this.change();
    };

    change = () => {
        this.fruits = harvestStore.getFruits();
        this.months = harvestStore.getMonths();
        this.totalWeight = harvestStore.getTotalWeight();
        this.activeMonth = harvestStore.getActiveMonth()
    };
}

harvesterModule.controller("HarvesterController", HarvesterController);


harvesterModule.filter('spacedNumber', function () {
    return function (text) {
        text = text.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
        return text;
    };
});



harvester(harvesterModule);

