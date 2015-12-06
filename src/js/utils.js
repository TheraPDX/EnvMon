const utils = {
  celsiusToFahrenheit(celsius) {
    return (celsius * 1.8) + 32;
  },
  // formats a number using fixed-point notation
  formatNumber(num, d) {
    return parseFloat(num, 10).toFixed(d)
  }
};

export default utils;
