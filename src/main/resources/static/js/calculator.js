let activityCounter = 1;

function addRow() {
  let tbody = document.querySelector("table");
  let row = document.createElement("tr");

  let name = document.createElement("td");
  name.innerHTML = "Activity " + activityCounter;

  let shortName = document.createElement("td");
  shortName.innerHTML = "A" + activityCounter;

  let weight = document.createElement("td");
  let weightInput = document.createElement("input");
  weightInput.type = "number";
  weightInput.id = "weight" + activityCounter;
  weight.appendChild(weightInput);

  let grade = document.createElement("td");

  let numeratorInput = document.createElement("input");
  numeratorInput.type = "number";
  numeratorInput.id = "numeratorInput" + activityCounter;
  grade.appendChild(numeratorInput);

  grade.appendChild(document.createTextNode(" / ")); // Use text node directly

  let denominatorInput = document.createElement("input");
  denominatorInput.type = "number";
  denominatorInput.id = "denominatorInput" + activityCounter;
  grade.appendChild(denominatorInput);

  let percent = document.createElement("td");
  percent.id = "percent" + activityCounter;
  percent.innerHTML = "";

  row.appendChild(name);
  row.appendChild(shortName);
  row.appendChild(weight);
  row.appendChild(grade);
  row.appendChild(percent);
  row.qu;
  tbody.appendChild(row);
  row
    .querySelectorAll(
      "input[type='number'][id^='numeratorInput'], input[type='number'][id^='denominatorInput']"
    )
    .forEach(function (input) {
      input.addEventListener("input", updatePercentage);
    });
  activityCounter += 1;
}

function updatePercentage() {
  console.log("updatePercentage function called");
  let numerator = parseFloat(
    this.parentNode.querySelector("input[type='number'][id^='numeratorInput']")
      .value
  );
  console.log("Numerator:", numerator);
  let denominator = parseFloat(
    this.parentNode.querySelector(
      "input[type='number'][id^='denominatorInput']"
    ).value
  );
  console.log("Denominator:", denominator);

  let percentCellId = this.parentNode.nextElementSibling.id;
  console.log("Percent Cell ID:", percentCellId);

  // 5 checks
  // 1,2) numerator and denominator must be non-empty
  // 3) the score obtained must be lower than full score
  // 4) the score obtained (numrator) must not be negative, but can be negative
  // 5) the full score must be positive => must not be negative or zero
  if (
    isNaN(numerator) ||
    isNaN(denominator) ||
    numerator > denominator ||
    numerator < 0 ||
    denominator <= 0
  ) {
    // If either numerator or denominator is not a valid number, set percentage to empty string
    document.getElementById(percentCellId).textContent = "";
    return; // Exit early to prevent further processing
  }

  // Calculate percentage and update the corresponding cell's text content
  let percentage = (numerator / denominator) * 100;
  document.getElementById(percentCellId).textContent =
    percentage.toFixed(2) + "%";
}

function calculateFinalMean() {
  console.log("mean");
  let percentages = document.querySelectorAll("[id ^= 'percent']");
  let count = 0;
  let sum = 0;

  for (let i = 0; i < percentages.length; i++) {
    const percentage = percentages[i].textContent;
    // 1 check => percentage must be non-empty
    if (percentage != "") {
      console.log(count);
      console.log(parseFloat(percentage.slice(0, -1)));
      count += 1;
      sum += parseFloat(percentage.slice(0, -1));
    } else {
      // stop if there is empty percent
      let result = document.getElementById("result");
      result.innerHTML = "";
      return;
    }
  }

  if (count === 0) {
    let result = document.getElementById("result");
    result.innerHTML = "";
    return;
  }

  let mean = sum / count;
  let result = document.getElementById("result");
  result.innerHTML = mean.toFixed(2) + "%";
}

function calculateFinalWeighted() {
  console.log("weighted");
  let percentages = document.querySelectorAll("[id ^= 'percent']");
  let weights = document.querySelectorAll("input[type='number'][id^='weight']");

  let count = 0;
  let sum = 0;
  for (let i = 0; i < percentages.length; i++) {
    const percentage = percentages[i].textContent;
    const weight = parseInt(weights[i].value);
    // 3 checks
    // 1. percentage must be non-empty (if non empty then it's a valid percentage, safeguarded by updatePercentage)
    // 2. weight must be non-empty => int(weight) != NaN
    // 3. weight cannot be negative, but can be 0
    if (percentage != "" && !isNaN(weight) && !(weight < 0)) {
      console.log("weight: " + weight);
      console.log("weighted: " + parseFloat(percentage.slice(0, -1)) * weight);
      count += weight;
      sum += parseFloat(percentage.slice(0, -1)) * weight;
      console.log("count: " + count);
    } else {
      // stop if there is empty percent or weight
      let result = document.getElementById("result");
      result.innerHTML = "";
      return;
    }
  }

  if (count === 0) {
    let result = document.getElementById("result");
    result.innerHTML = "";
    return;
  }

  let weighted = sum / count;
  let result = document.getElementById("result");
  result.innerHTML = weighted.toFixed(2) + "%";
}

function addEventListeners() {
  let gradeInputs = document.querySelectorAll(
    "input[type='number'][id^='numeratorInput'], input[type='number'][id^='denominatorInput']"
  );
  gradeInputs.forEach(function (input) {
    input.addEventListener("input", updatePercentage);
  });
  document
    .getElementById("meanButton")
    .addEventListener("click", calculateFinalMean);

  document
    .getElementById("weightedButton")
    .addEventListener("click", calculateFinalWeighted);
}

window.onload = function () {
  addRow();
  addRow();
};

document.addEventListener("DOMContentLoaded", function () {
  addEventListeners();
});
