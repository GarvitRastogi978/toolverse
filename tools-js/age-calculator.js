const dobInput = document.getElementById("dob");
const calculateBtn = document.getElementById("calculateAgeBtn");

const resultBox = document.getElementById("ageResult");
const yearsEl = document.getElementById("years");
const monthsEl = document.getElementById("months");
const daysEl = document.getElementById("days");

calculateBtn.addEventListener("click", () => {
  const dobValue = dobInput.value;
  if (!dobValue) {
    alert("Please select your date of birth");
    return;
  }

  const dob = new Date(dobValue);
  const today = new Date();

  if (dob > today) {
    alert("Date of birth cannot be in the future");
    return;
  }

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  yearsEl.textContent = years;
  monthsEl.textContent = months;
  daysEl.textContent = days;

  resultBox.classList.remove("hidden");
});
