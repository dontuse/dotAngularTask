import appDispatcher from '../dispatcher/appDispatcher.js';
import _ from 'lodash';
import {EventEmitter} from 'events';
import {actionType}  from  '../constants/constants.js';
import data from '../data.json';
import declension  from '../utils/declension.js';

let CHANGE_EVENT = 'change';

let _harvest = data;
let _months = [];
let _fruits = [];
let _fruitsResult = [];
let _maxTime;
let _totalWeight = 0;
let _fruitsPic = {
    "Kлубника": "1.png",
    "Малина": "2.png",
    "Яблоко": "3.png",
    "Груша": "4.png",
    "Бананы": "5.png",
    "Помидоры": "6.png",
    "Огурцы": "7.png",
    "Картофель": "8.png"
};

let _activeMonth = {};

let _selectedMonth = false;

_harvest.forEach((item) => {
    item.img = "no-pic.png";
    _.each(_fruitsPic, (img, index) => {
        (item.fruit === index) && (item.img = img);
    });
    item.harvest.forEach((harvest) => {
        harvest.date = new Date(harvest.date);
        harvest.time = +new Date(harvest.date);
    });
});

getAvailableMonths();
filterFruitsByTime();

function getAvailableMonths() {
    let harvestDates = [];
    let min;
    let max;
    let totalMonthsCount;
    let results = [];
    const msInMonth = 2629800000;

    _harvest.forEach((item) => {
        item.harvest.forEach((harvest) => {
            harvestDates.push(harvest.time);
        });
    });

    min = _.min(harvestDates);
    max = _maxTime = _.max(harvestDates);
    totalMonthsCount = Math.ceil((max - min) / msInMonth);

    for (let i = 1; totalMonthsCount >= i; i++) {
        results.push({
            val: i * msInMonth,
            text: i + " " + declension(i, ['месяц', 'месяцa', 'месяцев'])
        });
        // по умолчанию последний месяц активный
        !(i === totalMonthsCount) || (_activeMonth = {
            val: i * msInMonth,
            text: i + " " + declension(i, ['месяц', 'месяцa', 'месяцев'])

        });
    }

    _months = results;
}


function filterFruitsByTime(time = _maxTime) {
    _fruits = [];
    _totalWeight = 0;

    _harvest.forEach((fruit)=> {
        let computedFruit = {
            img: fruit.img,
            name: fruit.fruit,
            weight: 0
        };
        fruit.harvest.forEach((harvest) => {
            (time >= (_maxTime - harvest.time)) && (computedFruit.weight += harvest.weight);
        });
        if (!(computedFruit.weight === 0)) {
            _fruits.push(computedFruit);
            _totalWeight += Math.round(computedFruit.weight);
            computedFruit.weight = Math.round(computedFruit.weight);
        }

    });

    addFruitsRelativeWight();

    _fruits = _.sortBy(_fruits, 'weight').reverse();
}

function addFruitsRelativeWight() {
    let maxWeight = _.max(_fruits, 'weight').weight;

    _fruits.forEach((fruit) => {
        fruit.relativeWeight = fruit.weight / maxWeight * 100;
        (fruit.relativeWeight < 5) && (fruit.relativeWeight = 5);
    });
}


let harvestStore = _.assign({}, EventEmitter.prototype, {
    getMonths() {
        return _months;
    },
    getFruits() {
        return _fruits;
    },
    getTotalWeight() {
        return _totalWeight;
    },
    getActiveMonth() {
        return _activeMonth;
    },
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

harvestStore.dispatchToken = appDispatcher.register(function (action) {
    switch (action.type) {
        case actionType.GET_HARVESTER_BY_MONTH:
            getAvailableMonths(action.month);
            filterFruitsByTime(action.month.val);
            _activeMonth = action.month;
            harvestStore.emitChange();
            break;
        default:
            console.log(`незарегистрированный ${action.type}`);
    }
});

export default harvestStore;

