const it = require("itertools");

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

function permute(str, l, r, empty) {
  if (l == r) {
    empty.push(JSON.stringify(str));
    //console.log(`${str}`);
  } else {
    for (let i = l; i <= r; i++) {
      str = swap(str, l, i);
      permute(str, l + 1, r, empty);
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

const getSols = (arr, maxSum) => {
  let combinaisons = findSums(arr, maxSum);
  combinaisons = combinaisons.map((c) => JSON.stringify(c));
  let totalCombinaisons = Array.from(new Set(combinaisons)).map((_) =>
    JSON.parse(_)
  );
  combinaisons = Array.from(new Set(combinaisons)).map((_) => JSON.parse(_));
  combinaisons.forEach((combinaison) => {
    let combiSet = Array.from(new Set(combinaison));
    if (combinaison.length > 1 && combiSet.length > 1) {
      let empty = [];
      permute(combinaison, 0, combinaison.length - 1, empty);
      empty.forEach((e) => totalCombinaisons.push(JSON.parse(e)));
    }
  });
  totalCombinaisons = totalCombinaisons.map((c) => JSON.stringify(c));
  totalCombinaisons = Array.from(new Set(totalCombinaisons)).map((_) =>
    JSON.parse(_)
  );
  return totalCombinaisons;
};

const getScore = (combinaisons) => {
  let combiBySize = {};
  combinaisons.forEach((combinaison) => {
    let len = combinaison.length;
    if (!combiBySize[len]) {
      combiBySize[len] = [combinaison];
    } else {
      combiBySize[len] = combiBySize[len].concat([combinaison]);
    }
  });
  return combiBySize;
};

let initialArray = [2, 3, 4, 5, 9, 7, 2, 1];

let sols = getSols(initialArray, 5);

sols.forEach((sol) => console.log(sol));

console.log(getScore(sols));
