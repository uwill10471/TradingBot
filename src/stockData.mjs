
import mongoose from "mongoose";

import Alpaca from '@alpacahq/alpaca-trade-api'
import { getTodayDate, getYesterdayDate }from '../src/date.cjs'

// mongoose.connect('mongodb://localhost:27017/emaStockData')

const stockDataSchema = new mongoose.Schema({
  timestamp:Date,
  symbol:String,
  closingPrice:Number,
  openingPrice:Number,
  high:Number,
  low:Number,
  
})
const StockData = mongoose.model('StockData', stockDataSchema);

async function storeStockData(symbol,timeFrameValue,timeFrrame){
    try{

        const alpaca = new Alpaca({
  keyId: process.env.api_key,
  secretKey: process.env.api_secret,
  paper: true,
})

let bars;
if(timeFrrame == "MIN")
{
   bars =  alpaca.getBarsV2(symbol, {
  start: getYesterdayDate(),
  end: getTodayDate(),
  timeframe: alpaca.newTimeframe(timeFrameValue, alpaca.timeframeUnit.MIN),
  limit: 5,
})
}
if(timeFrrame == "HOUR")
{
   bars =  alpaca.getBarsV2(symbol, {
  start: getYesterdayDate(3),
  end: getTodayDate(2),
  timeframe: alpaca.newTimeframe(timeFrameValue, alpaca.timeframeUnit.HOUR),
  limit: 5,
})
}

if(timeFrrame == "DAY")
{
   bars =  alpaca.getBarsV2(symbol, {
  start: getYesterdayDate(),
  end: getTodayDate(),
  timeframe: alpaca.newTimeframe(timeFrameValue, alpaca.timeframeUnit.DAY),
  limit: 5,
})
}

if(timeFrrame == "WEEK")
{
   bars =  alpaca.getBarsV2(symbol, {
  start: getYesterdayDate(),
  end: getTodayDate(),
  timeframe: alpaca.newTimeframe(timeFrameValue, alpaca.timeframeUnit.WEEK),
  limit: 5,
})
}

if(timeFrrame == "MONTH")
{
  bars =  alpaca.getBarsV2(symbol, {
  start: getYesterdayDate(),
  end: getTodayDate(),
  timeframe: alpaca.newTimeframe(timeFrameValue, alpaca.timeframeUnit.MONTH),
  limit: 5,
})
}





//  const stockData = await bars.map(bar => ({
//             symbol: symbol,
//             timestamp: new Date(bar.Timestamp), // Assuming 't' represents the timestamp
//             closingPrice: bar.ClosePrice, // Assuming 'c' represents the closing price
//             high: bar.HighPrice, // Assuming 'h' represents the high price
//             low: bar.LowPrice, // Assuming 'l' represents the low price
//             openingPrice: bar.OpenPrice // Assuming 'o' represents the opening price
//         }));
let stockData = [];
// for await (let b of bars) {
  
  stockData.push(({
            // symbol: symbol,
            // timestamp: new Date(b.Timestamp), // Assuming 't' represents the timestamp
            // closingPrice: b.ClosePrice, // Assuming 'c' represents the closing price
            // high: b.HighPrice, // Assuming 'h' represents the high price
            // low: b.LowPrice, // Assuming 'l' represents the low price
            // openingPrice: b.OpenPrice // Assuming 'o' represents the opening price
              symbol: "AAPL",
          //  timestamp: new Date(b.Timestamp), // Assuming 't' represents the timestamp
            closingPrice: 174, // Assuming 'c' represents the closing price
            high: 180, // Assuming 'h' represents the high price
            low: 172, // Assuming 'l' represents the low price
            openingPrice: 171 // Assuming 'o' represents the opening price
        }));
// }

 await StockData.insertMany(stockData);
  return { message: 'Stock data stored successfully.' };

        

    }catch(error){
       
        console.error('Error storing stock data:', error);
        throw new Error('An error occurred while storing stock data.');
    }
}

export default  storeStockData;
