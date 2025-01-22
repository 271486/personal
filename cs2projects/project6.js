// Function that completes all its tasks inside
function task() {
    console.log("Task function started");
    // Add numbers 1-10
    let sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += i;
    }
    console.log(`Sum of numbers from 1 to 10: ${sum}`);
    console.log("Task function finished");
  }
  
  // Function that sends data back to the program
  function returnFunc(x, y) {
    let result = x + y;
    console.log("Return function finished");
    return result;
  }
  
  // Functions where one function calls the other
  function concatName(name) {
    console.log(`Hello, ${name}`);
    let message = funcInFunc();
    console.log(`Message from function call in a function: ${message}`);
  }
  
  function funcInFunc() {
    console.log("Function call in a function");
    return "Function call finished";
  }
  
  // Main program
  task();
  
  let result = returnFunc(5, 10);
  console.log(`Result from function: ${result}`);
  
  if (result > 10) {
    console.log("Result is greater than 10");
  } else {
    console.log("Result is less than or equal to 10");
  }
  
  concatName("World");
  