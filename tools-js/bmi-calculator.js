const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const calculateBtn = document.getElementById("calculateBtn");

const resultBox = document.getElementById("result");
const bmiValue = document.getElementById("bmiValue");
const bmiCategory = document.getElementById("bmiCategory");

calculateBtn.addEventListener("click", () => {
  const heightCm = parseFloat(heightInput.value);
  const weightKg = parseFloat(weightInput.value);

  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    alert("Please enter valid height and weight");
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const roundedBMI = bmi.toFixed(1);

  bmiValue.textContent = roundedBMI;
  bmiCategory.textContent = getBMICategory(bmi);

  resultBox.classList.remove("hidden");
});

function getBMICategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}
