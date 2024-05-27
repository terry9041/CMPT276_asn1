let activityCounter = 0;

function removeRow() {
  let tbody = document.querySelector("tbody");
  if (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.lastChild);
    activityCounter -= 1;
  }
}

function addRow() {
  activityCounter += 1;
  let tbody = document.querySelector("tbody");
  let row = document.createElement("tr");

  let name = document.createElement("td");
  name.innerHTML = "Activity " + activityCounter;

  let shortName = document.createElement("td");
  shortName.innerHTML = "A" + activityCounter;

  let weight = document.createElement("td");
  let weightInput = document.createElement("input");
  weightInput.type = "number";
  weightInput.id = "weight" + activityCounter;
  weightInput.min = 0;
  weight.appendChild(weightInput);

  let grade = document.createElement("td");

  let numeratorInput = document.createElement("input");
  numeratorInput.type = "number";
  numeratorInput.id = "numeratorInput" + activityCounter;
  numeratorInput.min = 0;
  grade.appendChild(numeratorInput);

  grade.appendChild(document.createTextNode(" / ")); // Use text node directly

  let denominatorInput = document.createElement("input");
  denominatorInput.type = "number";
  denominatorInput.id = "denominatorInput" + activityCounter;
  denominatorInput.min = 1;
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
    document.getElementById(percentCellId).textContent = "Invalid score input";
    return; // Exit early to prevent further processing
  }

  // Calculate percentage and update the corresponding cell's text content
  let percentage = (numerator / denominator) * 100;
  document.getElementById(percentCellId).textContent =
    percentage.toFixed(2) + "%";
}

function calculateFinalMean() {
  if (activityCounter === 0) {
    document.getElementById("result").innerHTML =
      "Please add the activity data";
    return;
  }
  let rows = document.querySelectorAll("tbody tr");
  let sum = 0;
  for (let i = 0; i < rows.length; i++) {
    const percent = rows[i].querySelector("[id^='percent']").innerHTML;
    // 2 checks
    // 1. percentage must not be Invalid score input (if non empty then it's a valid percentage, safeguarded by updatePercentage)
    // 2. percentage must be non empty
    if (percent == "Invalid score input") {
      document.getElementById("result").innerHTML =
        "Invalid score input at row " + (i + 1);
      return;
    }
    if (percent == "") {
      document.getElementById("result").innerHTML =
        "Please remove row " + (i + 1);
      return;
    }

    sum += parseFloat(percent.slice(0, -1));
  }
  let weighted = sum / activityCounter;
  let result = document.getElementById("result");
  result.innerHTML = weighted.toFixed(2) + "%";
}

function calculateFinalWeighted() {
  console.log(activityCounter);
  if (activityCounter === 0) {
    document.getElementById("result").innerHTML =
      "Please add the activity data";
    return;
  }
  let rows = document.querySelectorAll("tbody tr");
  let count = 0;
  let sum = 0;
  for (let i = 0; i < rows.length; i++) {
    const percent = rows[i].querySelector("[id^='percent']").innerHTML;
    const weight = parseInt(rows[i].querySelector("[id^='weight']").value);
    // 3 checks
    // 1. percentage must not be Invalid score input (if non empty then it's a valid percentage, safeguarded by updatePercentage)
    // 2. weight must be non-empty => int(weight) != NaN
    // 3. weight cannot be negative, but can be 0
    if (percent == "Invalid score input") {
      document.getElementById("result").innerHTML =
        "Invalid score input at row " + (i + 1);
      return;
    }
    if (isNaN(weight)) {
      document.getElementById("result").innerHTML =
        "Empty weight at row " + (i + 1);
      return;
    }
    if (weight < 0) {
      document.getElementById("result").innerHTML =
        "Invalid weight at row " + (i + 1);
      return;
    }

    count += weight;
    sum += parseFloat(percent.slice(0, -1)) * weight;
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

  document.getElementById("removeButton").addEventListener("click", removeRow);
  document.getElementById("addButton").addEventListener("click", addRow);
  document
    .getElementById("meanButton")
    .addEventListener("click", calculateFinalMean);

  document
    .getElementById("weightedButton")
    .addEventListener("click", calculateFinalWeighted);
  console.log("added");
}

document.addEventListener("DOMContentLoaded", function () {
  addEventListeners();
  addRow();
  addRow();
});
