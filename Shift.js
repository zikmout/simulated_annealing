const it = require("itertools");

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};
function powerset(arr) {
  var ps = [[]];
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0, len = ps.length; j < len; j++) {
      ps.push(ps[j].concat(arr[i]));
    }
  }
  return ps;
}
function sum(arr) {
  var total = 0;
  for (var i = 0; i < arr.length; i++) total += arr[i];
  return total;
}
function findSums(numbers, targetSum) {
  var sumSets = [];
  var numberSets = powerset(numbers);
  for (var i = 0; i < numberSets.length; i++) {
    var numberSet = numberSets[i];
    let tmpSum = sum(numberSet);
    if (tmpSum <= targetSum && tmpSum > 0) sumSets.push(numberSet);
  }
  return sumSets;
}
const getCombinaisons = (numbers, targetSum) => {
  let combinaisons = findSums(numbers, targetSum);
  combinaisons = combinaisons.map((c) => JSON.stringify(c));
  combinaisons = Array.from(new Set(combinaisons)).map((_) => JSON.parse(_));
  return combinaisons;
};
function permute(str, l, r) {
  if (l == r) console.log(`${str}`);
  else {
    for (let i = l; i <= r; i++) {
      str = swap(str, l, i);
      permute(str, l + 1, r);
      str = swap(str, l, i);
    }
  }
}
function swap(a, i, j) {
  let temp;
  let charArray = a; //.split("");
  temp = charArray[i];
  charArray[i] = charArray[j];
  charArray[j] = temp;
  let sum = charArray.reduce((partialSum, a) => partialSum + a, 0);
  // console.log(`sum : ${sum}`);
  return charArray; //.join("");
}
const getProbability = (f1, f2, temp) => {
  if (f2 < f1) return 1;
  return Math.exp((f1 - f2) / temp);
};
const getDistance = (shift1, shift2) => {
  return Math.abs(shift1.emptySpace - shift2.emptySpace);
};
const reducer = (accumulator, currentValue) => accumulator + currentValue;

class Shift {
  constructor(length, arr) {
    this.length = length;
    this.arr = arr;
    this.emptySpace = length - arr.reduce(reducer);
  }

  duplicate = () => {
    return new Shift(this.length, [...this.arr], this.emptySpace);
  };
}

class Planning {
  constructor(lengthsList, people, init = true) {
    this.lengthsList = lengthsList;
    this.people = [...people];
    this.remainingPeople = [...people];
    this.usedSpace = 0;

    if (init) {
      let planning = Array.apply(null, Array(lengthsList.length)).map(
        (_) => []
      );
      for (let i = 0; i < planning.length; i++) {
        let len = lengthsList[i];
        let combinaisons = getCombinaisons(this.remainingPeople, len);
        let randomCombinaison = combinaisons[getRandomInt(combinaisons.length)];
        let shift = new Shift(len, randomCombinaison);
        randomCombinaison.forEach((combi) => {
          let idx = this.remainingPeople.indexOf(combi);
          this.usedSpace += this.remainingPeople[idx];
          this.remainingPeople.splice(idx, 1);
        });
        planning[i] = shift;
      }
      this.planning = planning;
      this.emptySpace = this.remainingPeople.reduce(reducer);
    } else {
      this.planning = Array.apply(null, Array(lengthsList.length)).map(
        (_) => []
      );
      this.emptySpace = this.remainingPeople.reduce(reducer);
    }
  }

  getShift = (index) => {
    return this.planning[index];
  };

  duplicate = () => {
    let newPlanning = new Planning(
      [...this.lengthsList],
      [...this.people],
      false
    );

    let newPlanningLength = newPlanning.planning.length;
    for (let i = 0; i < newPlanningLength; i++) {
      newPlanning.planning[i] = this.getShift(i).duplicate();
    }
    newPlanning.remainingPeople = this.remainingPeople;
    newPlanning.emptySpace = this.emptySpace;
    newPlanning.usedSpace = this.usedSpace;
    return newPlanning;
  };
}

class simulatedAnnealing {
  constructor(planning, temperature, coolingFactor) {
    this.planning = planning;
    this.temperature = temperature;
    this.coolingFactor = coolingFactor;
  }

  solve = () => {
    console.log("Solving ....");
    console.log(this.planning);
    console.log("------------------------------------------");
    console.log(this.planning.duplicate());
  };
}

let emptySlots = [8, 6, 8, 6, 8, 6, 8, 6];
let people = [4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6];
let temperature = 1000;
let coolingFactor = 0.995;

let planning = new Planning(emptySlots, people);
// console.log(planning);

let sa = new simulatedAnnealing(planning, temperature, coolingFactor);
sa.solve();
