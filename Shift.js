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

const reducer = (accumulator, currentValue) => accumulator + currentValue;

let emptySlots = [8, 6, 8, 6, 8, 6, 8, 6];
let people = [4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6];

class Shift {
  constructor(length, arr) {
    this.length = length;
    this.arr = arr;
    this.emptySpace = length - arr.reduce(reducer);
  }
}

class Planning {
  constructor(lengthsList, people) {
    this.lengthsList = lengthsList;
    this.people = [...people];
    this.remainingPeople = [...people];

    let planning = Array.apply(null, Array(lengthsList.length)).map((_) => []);

    for (let i = 0; i < planning.length; i++) {
      //   console.log("deb");
      let len = lengthsList[i];
      let combinaisons = getCombinaisons(this.remainingPeople, len);
      let randomCombinaison = combinaisons[getRandomInt(combinaisons.length)];
      //   console.log(
      //     `\nremainingPeople : ${JSON.stringify(this.remainingPeople)}`
      //   );
      //   console.log(`len : ${len}`);
      //   console.log("combinaisons II", combinaisons);
      //   console.log("randomCombinaison", randomCombinaison);

      let shift = new Shift(len, randomCombinaison);
      randomCombinaison.forEach((combi) => {
        let idx = this.remainingPeople.indexOf(combi);
        this.remainingPeople.splice(idx, 1);
      });
      planning[i] = shift;
    }
    this.planning = planning;
  }
}

let planning = new Planning(emptySlots, people);
console.log(planning);
