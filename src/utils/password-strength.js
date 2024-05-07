/**
 * Password validator for login pages
 */

import value from "assets/scss/_themes-vars.module.scss";

// has number
const hasNumber = (number) => new RegExp(/[0-9]/).test(number);

// has mix of small and capitals
const hasMixed = (number) =>
  new RegExp(/[a-z]/).test(number) && new RegExp(/[A-Z]/).test(number);

// has special chars
const hasSpecial = (number) => new RegExp(/[!#@$%^&*)(+=._-]/).test(number);

// has unique chars
const hasUnique = (number) => {
  const unique = number
    .split("")
    .filter(function (x, n, s) {
      return s.indexOf(x) == n;
    })
    .join("");
  return unique;
};

// set color based on password strength
export const strengthColor = (count) => {
  if (count <= 20) return { label: "Poor", color: value.errorMain };
  if (count <= 30) return { label: "Weak", color: value.orangeLight };
  if (count <= 40) return { label: "Normal", color: value.warningMain };
  if (count <= 42) return { label: "Good", color: value.successLight };
  if (count <= 44) return { label: "Strong", color: value.successMain };
  return false;
};

// password strength indicator
export const strengthIndicator = (number) => {
  let strengths = 0;
  if (number.length > 7) strengths += 10;
  if (hasNumber(number)) strengths += 10;
  if (hasSpecial(number)) strengths += 10;
  if (hasMixed(number)) strengths += 10;
  if (number.length > 12) strengths += 1;
  if (number.length > 18) strengths += 1;
  if (hasUnique(number).length > 10) strengths += 1;
  if (hasUnique(number).length > 15) strengths += 1;
  return strengths;
};
