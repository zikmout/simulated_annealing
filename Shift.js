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

  noShifts = () => {
    return this.planning.length;
  };

  //   swapShifts = (index1, index2) => {
  //     // Try custom ES6 Syntax
  //     // [this.planning[index1], this.planning[index2]] = [
  //     //   this.planning[index2],
  //     //   this.planning[index1],
  //     // ];
  //     let tmp = this.getShift(index1).duplicate();
  //     this.planning[index1] = this.getShift(index2).duplicate();
  //     this.planning[index2] = tmp
  //   };

  computeSpaces = () => {
    let newEmptySpace = 0;
    for (let i = 0; i < this.planning.length; i++) {
      newEmptySpace += this.planning[i].emptySpace;
    }
    this.emptySpace = newEmptySpace;
    this.usedSpace = this.people.reduce(reducer) - newEmptySpace;
  };

  randomGenerateShift = (index) => {
    let oldShift = this.getShift(index).duplicate();
    // console.log("oldShift", oldShift);

    let maxShiftLength = oldShift.length;
    let oldRemainingPeople = [...this.remainingPeople];
    // console.log(`oldRemainingPeople : ${JSON.stringify(oldRemainingPeople)}`);

    let arr = [...oldShift.arr].concat(oldRemainingPeople); // new temp remaining people before new Shift

    // console.log(`arr : ${JSON.stringify(arr)}`);
    let newRemainingPeople = [...arr];

    let combinaisons = getCombinaisons(arr, maxShiftLength);
    let randomCombinaison = combinaisons[getRandomInt(combinaisons.length)];
    // console.log(`randomCombinaison : ${JSON.stringify(randomCombinaison)}`);
    let newShift = new Shift(maxShiftLength, randomCombinaison);
    // console.log("newShift", newShift);
    // console.log(`newRemainingPeople : ${JSON.stringify(newRemainingPeople)}`);

    for (let i = 0; i < newShift.arr.length; i++) {
      let idx = newRemainingPeople.indexOf(newShift.arr[i]);
      newRemainingPeople = newRemainingPeople.splice(idx, 1);
    }

    this.remainingPeople = newRemainingPeople;
    this.planning[index] = newShift;
    this.computeSpaces();
  };
}

class simulatedAnnealing {
  constructor(temperature, coolingFactor) {
    this.temperature = temperature;
    this.coolingFactor = coolingFactor;
  }

  solve = () => {
    console.log("Solving ....");
    let emptySlots = [8, 6, 8, 6, 8, 6, 8, 6];
    let people = [4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6];
    let current = new Planning(emptySlots, people);
    let best = current.duplicate();

    for (let t = this.temperature; t > 1; t = t * this.coolingFactor) {
      let neighbor = current.duplicate();
      let nb = neighbor.noShifts();
      let index1 = getRandomInt(nb);
      //   let index2 = getRandomInt(nb);
      //   neighbor.swapShifts(index1, index2);
      for (let x = 0; x < nb; x++) {
        neighbor.randomGenerateShift(x);
      }
      //   neighbor.randomGenerateShift(index1);

      let currentEmptySpace = current.emptySpace;
      let neighborEmptySpace = neighbor.emptySpace;
      let delatE = currentEmptySpace - neighborEmptySpace;
      console.log("deltaE : ", delatE);

      console.log(
        `proba : ${getProbability(
          currentEmptySpace,
          neighborEmptySpace,
          this.temperature
        )}`
      );
      if (
        Math.random(0.5) <
        getProbability(currentEmptySpace, neighborEmptySpace, this.temperature)
      ) {
        current = neighbor.duplicate();
      }

      if (current.emptySpace < best.emptySpace) {
        best = current.duplicate();
      }
    }
    console.log("\n\nBEST EmptySpace : ", best.emptySpace);
  };
}

let temperature = 100;
let coolingFactor = 0.9;

// let planning = new Planning(emptySlots, people);

let sa = new simulatedAnnealing(temperature, coolingFactor);
sa.solve();
