import Alpaca from '@alpacahq/alpaca-trade-api'

const alpaca = new Alpaca({
  keyId: process.env.api_key,
  secretKey: process.env.api_secret,
  paper: true,
})


function stockEma(price){
    
// to run code until criteria is met

//Function to perform a specific task
async function performTask() {
    // Implement your task logic here
    

}
// Define the criteria function to determine whether to continue running the task
function shouldContinue() {
    // Implement your criteria logic here
    // For example, return false when the task should stop
    return true;
}

//Define the delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to run the task continuously
async function runTaskContinuously() {
    while (shouldContinue()) {
        await performTask(); // Execute the task
        await delay(5000); // Wait for 5 seconds (adjust as needed)
    }
    console.log("Task stopped because criteria were met.");
}

// Start running the task continuously
runTaskContinuously()
    .catch(error => console.error("An error occurred:", error));


}