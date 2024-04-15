

// Function to calculate Exponential Moving Average (EMA)
function calculateEMA(prices, period) {
  const ema = [];
  const multiplier = 2 / (period + 1);
  let sum = prices.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
  ema.push(sum);
  for (let i = period; i < prices.length; i++) {
    sum = (prices[i] - sum) * multiplier + sum;
    ema.push(sum);
  }
  return ema;
}

// Function to calculate Simple Moving Average (SMA)
function calculateSMA(prices, period) {
  const sma = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
    sma.push(sum / period);
  }
  return sma;
}

// Function to calculate Standard Deviation
function calculateStandardDeviation(prices, period) {
  const stdDev = [];
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const mean = slice.reduce((acc, val) => acc + val, 0) / period;
    const variance = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
    stdDev.push(Math.sqrt(variance));
  }
  return stdDev;
}

module.exports = {
  calculateEMA,
  calculateSMA,
  calculateStandardDeviation
};

// // Get historical data
// alpaca.getBars(timeframe, symbol, { limit }).then((bars) => {
//   const prices = bars[symbol].map(bar => bar.c); // Extract closing prices
//   const ema = calculateEMA(prices, 20); // Calculate EMA (20-period)
//   const stdDev = calculateStandardDeviation(prices, 20); // Calculate standard deviation
//   const sma = calculateSMA(prices, 20); // Calculate SMA (20-period)

//   // Calculate upper and lower Bollinger Bands
//   const upperBand = sma.map((value, index) => value + 2 * stdDev[index]);
//   const lowerBand = sma.map((value, index) => value - 2 * stdDev[index]);

//   console.log('EMA:', ema);
//   console.log('Upper Bollinger Band:', upperBand);
//   console.log('Lower Bollinger Band:', lowerBand);
// }).catch((err) => {
//   console.error('Error getting bars:', err);
// });

