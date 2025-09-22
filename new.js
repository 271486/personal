// Prompt variable declaration for user input
var prompt = require('prompt-sync')(); 

// Main Function
function main_function() {
  console.log('Welcome to "restaurant name"s ordering system.');
  let done = false; // Variable to control the main menu loop
  var orders = {}; // Dictionary to store user orders
  do {
    // Display the main menu
    console.log('Main Menu');
    console.log('===============');
    console.log(
      'A - Appetizers \n' +
        'B - Beverages \n' +
        'C - Specials \n' +
        'D - Desserts \n' +
        'E - Entrees \n' +
        'F - View Order \n' +
        'G - Modify Order \n' +
        'H - Place Order \n' +
        'I - Exit'
    );
    let choice = prompt('Select an option: ').toLowerCase(); // Get user choice
    // Handles what user selects
    if (choice == 'a') {
      appetizers(orders);
    } else if (choice == 'b') {
      beverages(orders);
    } else if (choice == 'c') {
      specials(orders);
    } else if (choice == 'd') {
      desserts(orders);
    } else if (choice == 'e') {
      entrees(orders);
    } else if (choice == 'f') {
      view_order(orders);
    } else if (choice == 'g') {
      modify_order(orders);
    } else if (choice == 'h') {
      place_order(orders);
    } else if (choice == 'i') {
      done = true; // Exit the loop
      console.log('Thank you!');
    } else {
      console.log('Invalid Option. Try again.');
    }
  } while (!done); // Repeat until the user chooses to exit
}

// Dictionaries for menu items
// Each dictionary contains menu items with their names and prices

// Dictionary of appetizers items
const appetizers_menu = {
  1: { name: 'Boneless Wings', price: 14.99 },
  2: { name: 'Mozzarella Sticks', price: 7.49 },
  3: { name: 'Loaded French Fries', price: 9.99 },
  4: { name: 'Breadsticks', price: 5.99 },
  5: { name: 'Sliders', price: 9.99 },
  6: { name: 'Nachos', price: 8.99 },
};

// Dictionary of beverages items
const beverages_menu = {
  1: { name: 'Soda of Choice', price: 1.99 },
  2: { name: 'Juice of Choice', price: 2.99 },
  3: { name: 'Water', price: 0.0 },
  4: { name: 'Coffee', price: 2.99 },
  5: { name: 'Tea', price: 2.99 },
};

// Dictionary of specials items
const specials_menu = {
  1: { name: 'Grilled Chicken Parmesan', price: 16.99 },
  2: { name: 'Fried Calamari', price: 14.99 },
  3: { name: 'Chiptole Turkey Wrap', price: 18.99 },
  4: { name: 'Stuffed Peppers', price: 15.99 },
  5: { name: 'Chicken Alfredo', price: 14.99 },
};
// Dictionary of desserts items
const desserts_menu = {
  1: { name: 'Chocolate Cake', price: 6.99 },
  2: { name: 'Cheesecake', price: 7.99 },
  3: { name: 'Tiramisu', price: 9.99 },
  4: { name: 'Creme Brulee', price: 8.99 },
  5: { name: 'Souflee', price: 7.99 },
};

// Dictionary of entrees items
const entrees_menu = {
  1: { name: 'Ribeye Steak', price: 24.99 },
  2: { name: 'Grilled Salmon', price: 22.99 },
  3: { name: 'Lobster', price: 29.99 },
  4: { name: 'Sushi Platter', price: 26.99 },
  5: { name: 'Beef Wellington', price: 28.99 },
};

// Function to add a user's selection to the orders dictionary
function add_order(item, order, source, quant) {
  let next_ID = Object.keys(order).length + 1;
  if (item in source) { 
    order[next_ID] = {
      name: source[item].name,
      price: source[item].price,
      quantity: quant,
    };
  }
}

/* Function to display a menu and allow the user to order items. Made this to avoid repetition
 of code for each menu category */
function order_items(menu, orders, category) {
  console.log(`${category} Menu`);
  console.log('ID: Name - Price');
  for (let key1 in menu) {
    if (menu.hasOwnProperty(key1)) {
      console.log(`${key1}: ${menu[key1].name} - $${menu[key1].price}`);
    }
  }
  let choice;
  do { 
    choice = prompt(`Do you want to order any ${category.toLowerCase()}s? [Yes/No]: `).toLowerCase();
    if (choice == 'yes') {
      let itemChoice;
      do {
        itemChoice = parseInt(prompt(`What is the ID of the ${category.toLowerCase()} you want?: `));
        if (!(itemChoice in menu)) {
          console.log('Invalid Choice');
        } else {
          let itemQuant = parseInt(prompt('How many would you like?: '));
          add_order(itemChoice, orders, menu, itemQuant);
        }
      } while (!(itemChoice in menu)); 
    }
  } while (choice != 'yes' && choice != 'no'); 
}

// Functions for each menu category 
// Each function calls the order_items function with the chosen menu and orders dictionary
// Function to order appetizers
function appetizers(orders) {
  order_items(appetizers_menu, orders, 'Appetizer');
}

// Function to order beverages
function beverages(orders) {
  order_items(beverages_menu, orders, 'Beverage');
}

// Function to order specials
function specials(orders) {
  order_items(specials_menu, orders, 'Special');
}

// Function to order desserts
function desserts(orders) {
  order_items(desserts_menu, orders, 'Dessert');
}

// Function to order entrees
function entrees(orders) {
  order_items(entrees_menu, orders, 'Entree');
}

// Function to view the current order
function view_order(order) {
  console.log('ID: Name - Price - Quantity');
  for (let key in order) {
    console.log(`${key}: ${order[key].name} - $${order[key].price} - ${order[key].quantity}`);
  }
}

// Function to modify the current order by either deleting an item or modifying its quantity
function modify_order(order) {
  view_order(order); // Display the current order
  let change;
  do {
    // Ask the user if they want to modify their order
    change = prompt('Do you want to modify your order? [Yes/No]: ').toLowerCase();
    if (change == 'yes') {
      let change2;
      do {
        change2 = prompt('Do you want to delete or modify the quantity of an item? [Delete/Modify]: ').toLowerCase();
        if (change2 == 'delete') {
          let change3;
          do {
            change3 = parseInt(prompt('What is the ID of the item you want to delete?: '));
            if (!(change3 in order)) {
              console.log('Invalid ID');
            } else {
              delete order[change3]; // Remove the item from the order
              console.log('Item deleted.');
              break; // Exit the loop if the item is deleted
            }
          } while (true);
        } else if (change2 == 'modify') {
          let change3;
          do {
            change3 = parseInt(prompt('What is the ID of the item you want to modify?: '));
            if (!(change3 in order)) {
              console.log('Invalid ID');
            } else {
              let newQuant = parseInt(prompt('How much do you want?: '));
              order[change3].quantity = newQuant; // Updates the quantity
              console.log('Item quantity updated.');
            }
          } while (!(change3 in order));
        } else {
          console.log('Invalid Option');
        }
      } while (change2 != 'delete' && change2 != 'modify');
    }
  } while (change != 'yes' && change != 'no'); // Repeat until the user chooses yes or no
}

// Function to place the order and calculate the total
function place_order(order) {
  let totalPrice = 0;
  let subtotalPrice = 0;
  let finished;
  do {
    finished = prompt('Are you done ordering? [Yes/No]: ').toLowerCase();
    if (finished == 'yes') {
      // Calculate subtotal
      for (let key1 in order) {
        if (order.hasOwnProperty(key1)) {
          subtotalPrice += order[key1].price * order[key1].quantity;
        }
      }
      totalPrice = subtotalPrice;
      console.log(`Subtotal: $${totalPrice.toFixed(2)}`);
      // Ask for tip
      let tip = 0;
      let tipChoice;
      // Ask if user wants to tip
      do {
        tipChoice = prompt('Do you want to leave a tip? [Yes/No]: ').toLowerCase();
        if (tipChoice != 'yes' && tipChoice != 'no') {
          console.log('Invalid Option.');
        }
      } while (tipChoice != 'yes' && tipChoice != 'no');
      if (tipChoice == 'yes') {
        tip = parseFloat(prompt('How much would you like to tip in decimal? [15% = .15]: '));
        totalPrice += subtotalPrice*tip;
      }
      let tipAmount = subtotalPrice*tip;
      // Get delivery method
      let method;
      do {
        method = prompt('Pick-up or Delivery? Delivery has a $5 fee. [Pick-up/Delivery]: ').toLowerCase();
        if (method != 'pick-up' && method != 'delivery') {
          console.log('Invalid Option.');
        }
      } while (method != 'pick-up' && method != 'delivery');
      // Get local tax
      let tax = parseFloat(prompt('What is your state sales tax in decimal? [6% = .06]: '));
      // Get payment method
      let payment;
      do {
        payment = prompt('Card or Cash? Card has a 2% fee. [Card/Cash]: ').toLowerCase();
        if (payment != 'card' && payment != 'cash') {
          console.log('Invalid Option.');
        }
      } while (payment != 'card' && payment != 'cash');
      // Add delivery fee if chosen
      if (method == 'delivery') {
        totalPrice += 5;
      }
      // Adding tax after tip and delivery fee(if applicable) to simulate real world scenarios
      let taxAmount = totalPrice*tax
      totalPrice += taxAmount;
      // Add card fee if chosen
      if (payment == 'card') {
        totalPrice *= 1.02;
      }
      // Display total cost in a receipt format
      console.log('======= Receipt =======');
      console.log('Item - Price - Quantity - Item Total');
      for (let rKey in order) {
        console.log(`${order[rKey].name} - $${order[rKey].price} - ${order[rKey].quantity} - $${(order[rKey].price * order[rKey].quantity).toFixed(2)}`);
      }
      console.log('Subtotal: $'+subtotalPrice.toFixed(2));
      if (method == 'delivery') {
        console.log('Delivery Fee: $5.00');
      }
      if (payment == 'card') {
        console.log(`Card Fee: $${(totalPrice*0.05).toFixed(2)}`);
      }
      if (tipChoice == 'yes') {
        console.log(`Tip: $${(tipAmount).toFixed(2)}`);
      }
      console.log(`Tax: $${taxAmount.toFixed(2)}`);
      console.log(`Total: $${totalPrice.toFixed(2)}`);
    } else if (finished == 'no') {
      console.log('Continue Ordering.');
    } else {
      console.log('Invalid Option.');
    }
  } while (finished != 'yes' && finished != 'no');
}

main_function();