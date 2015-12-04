const utils = {
  celsiusToFahrenheit(celsius) {
    return (celsius * 1.8) + 32;
  },
  // Custom toFixed(): formats a number using fixed-point notation
  toFixed(num, dp) {
    return Math.floor(num * Math.pow(10, dp)) / Math.pow(10, dp);
  }
};

export default utils;
