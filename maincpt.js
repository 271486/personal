// Prompt Variable Declaration
var prompt = require('prompt-sync')();
// Main Function
function main_function() {
    console.log('Welcome to "restaurant name"s ordering system.');
    let done = false;
    var priceT = 0;
    var orders = {};
    do {
        console.log('Main Menu');
        console.log('===============');
        console.log('A - Appetizers \n' +
            'B - Beverages \n' +
            'C - Specials \n' +
            'D - Desserts \n' +
            'E - Entrees \n' +
            'F - View Order \n' +
            'G - Modify Order \n' +
            'H - Place Order \n' +
            'I - Exit');
        let choice = prompt('Select an option: ').toLowerCase();
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
            done = true;
            console.log('Exiting');
        } else {
            console.log('Invalid Option. Try again.');
        }
    } while (!done);
};


// Dictionary of appetizers
const appetizers_menu = {
    '1': { name: 'Boneless Wings', price: 14.99},
    '2': { name: 'Mozzarella Sticks', price: 7.49},
    '3': { name: 'Loaded French Fries', price: 9.99},
    '4': { name: 'Breadsticks', price: 5.99},
    '5': { name: 'Sliders', price: 9.99},
    '6': { name: 'Nachos', price: 8.99}
};
// Dictionary of beverages
const beverages_menu = {
    '1': { name: 'Soda of Choice', price: 1.99},
    '2': { name: 'Juice of Choice', price: 2.99},
    '3': { name: 'Water', price: 0.00},
    '4': { name: 'Coffee', price: 2.99},
    '5': { name: 'Tea', price: 2.99}
};
// Dictionary of specials
const specials_menu = {
    '1': { name: 'Grilled Chicken Parmesan', price: 16.99},
    '2': { name: 'Fried Calamari', price: 14.99},
    '3': { name: 'Chiptole Turkey Wrap', price: 18.99},
    '4': { name: 'Stuffed Peppers', price: 15.99},
    '5': { name: 'Chicken Alfredo', price: 14.99}
};
// Dictionary of desserts
const desserts_menu = {
    '1': { name: 'Chocolate Cake', price: 6.99},
    '2': { name: 'Cheescake', price: 7.99},
    '3': { name: 'Tiramisu', price: 9.99},
    '4': { name: 'Creme Brulee', price: 8.99},
    '5': { name: 'Souflee', price: 7.99}
};
// Dictionary of entrees
const entrees_menu = {
    '1': { name: 'Ribeye Steak', price: 24.99},
    '2': { name: 'Grilled Salmon', price: 22.99},
    '3': { name: 'Lobster', price: 29.99},
    '4': { name: 'Sushi Platter', price: 26.99},
    '5': { name: 'Beef Wellington', price: 28.99}
};
// Function to add users selection to orders dictionary
function add_order(selection, item, order, source, quant) {
    let next_ID = Object.keys(order).length+1
    for (let key = 0; key < selection.length; key++) {
        if (key in source) {
            order[next_ID] = source[item]
            order[next_ID].quantity = quant
        }
    };
}

// Appetizers Functions
function appetizers(orders) {
    console.log('Appetizers Menu');
    console.log('ID: Name - Price');
    for (let key1 in appetizers_menu) {
        if (appetizers_menu.hasOwnProperty(key1)) {
            console.log(`${key1}: ${appetizers_menu[key1].name} - $${appetizers_menu[key1].price}`);
            key1++;
        }
    }
    let choice2 = prompt('Do you want to order any appetizers? [Yes/No]: ').toLowerCase();
    if (choice2 == 'yes') {
        do {
            appChoice = parseInt(prompt('What is the ID of the appetizer you want?: '));
            if (!(appChoice in appetizers_menu)) {
                console.log('Invalid Choice');
            } else {
                let appQuant = parseInt(prompt('How many would you like?: '));
                let addAppChoice = ['name', 'price']
                add_order(addAppChoice, appChoice, orders, appetizers_menu, appQuant)

            }
        } while (!(appChoice in appetizers_menu));
    }
}

// Beverages Function
function beverages(orders) {
    console.log('Beverages Menu');
    console.log('ID: Name - Price');
    for (let key1 in beverages_menu) {
        if (beverages_menu.hasOwnProperty(key1)) {
            console.log(`${key1}: ${beverages_menu[key1].name} - $${beverages_menu[key1].price}`);
            key1++;
        }
    }
    let choice3 = prompt('Do you want to order any beverage? [Yes/No]: ').toLowerCase();
    if (choice3 == 'yes') {
        do {
            bevChoice = parseInt(prompt('What is the ID of the beverage you want?: '));
            if (!(bevChoice in beverages_menu)) {
                console.log('Invalid Choice');
            } else {
                let bevQuant = parseInt(prompt('How many would you like?: '));
                let addBevChoice = ['name', 'price']
                add_order(addBevChoice, bevChoice, orders, beverages_menu, bevQuant)

            }
        } while (!(bevChoice in beverages_menu));
    }
}
function specials(orders) {
    console.log('Specials Menu');
    console.log('ID: Name - Price');
    for (let key1 in specials_menu) {
        if (specials_menu.hasOwnProperty(key1)) {
            console.log(`${key1}: ${specials_menu[key1].name} - $${specials_menu[key1].price}`);
            key1++;
        }
    }
    let choice4 = prompt('Do you want to order any specials? [Yes/No]: ').toLowerCase();
    if (choice4 == 'yes') {
        do {
            specChoice = parseInt(prompt('What is the ID of the special you want?: '));
            if (!(specChoice in specials_menu)) {
                console.log('Invalid Choice');
            } else {
                let specQuant = parseInt(prompt('How many would you like?: '));
                let addSpecChoice = ['name', 'price']
                add_order(addSpecChoice, specChoice, orders, specials_menu, specQuant)

            }
        } while (!(specChoice in specials_menu));
    }
}

function desserts(orders) {
    console.log('Desserts Menu');
    console.log('ID: Name - Price');
    for (let key1 in desserts_menu) {
        if (desserts_menu.hasOwnProperty(key1)) {
            console.log(`${key1}: ${desserts_menu[key1].name} - $${desserts_menu[key1].price}`);
            key1++;
        }
    }
    let choice5 = prompt('Do you want to order any desserts? [Yes/No]: ').toLowerCase();
    if (choice5 == 'yes') {
        do {
            desChoice = parseInt(prompt('What is the ID of the dessert you want?: '));
            if (!(desChoice in desserts_menu)) {
                console.log('Invalid Choice');
            } else {
                let desQuant = parseInt(prompt('How many would you like?: '));
                let addDesChoice = ['name', 'price']
                add_order(addDesChoice, desChoice, orders, desserts_menu, desQuant)

            }
        } while (!(desChoice in desserts_menu));
    }
}


function entrees(orders) {
    console.log('Entrees Menu');
    console.log('ID: Name - Price');
    for (let key1 in entrees_menu) {
        if (entrees_menu.hasOwnProperty(key1)) {
            console.log(`${key1}: ${entrees_menu[key1].name} - $${entrees_menu[key1].price}`);
            key1++;
        }
    }
    let choice6 = prompt('Do you want to order any entrees? [Yes/No]: ').toLowerCase();
    if (choice6 == 'yes') {
        do {
            entChoice = parseInt(prompt('What is the ID of the entree you want?: '));
            if (!(entChoice in entrees_menu)) {
                console.log('Invalid Choice');
            } else {
                let entQuant = parseInt(prompt('How many would you like?: '));
                let addEntChoice = ['name', 'price']
                add_order(addEntChoice, entChoice, orders, entrees_menu, entQuant)

            }
        } while (!(entChoice in entrees_menu));
    }
}



function view_order(order) {
    console.log('ID: Name - Price - Quantity')
    for (let key in order) {
        console.log(`${key}: ${order[key].name} - $${order[key].price} - ${order[key].quantity}`)
    }
}


function modify_order(order) {
    console.log('ID: Name - Price - Quantity')
    for (let key in order) {
        console.log(`${key}: ${order[key].name} - $${order[key].price} - ${order[key].quantity}`)
    }
    let change = prompt('Do you want to modify your order? [Yes/No]: ').toLowerCase()
    if (change == 'yes') {
        do {
            change2 = prompt('Do you want to delete or modify the quantity of an item? [Delete/Modify]: ').toLowerCase()
            if (change2 == 'delete') {
                do {
                    change3 = parseInt(prompt('What is the ID of the item you want to delete?: '))
                    if (!(change3 in order)) {
                        console.log('Invalid ID')
                    } else {
                        delete order[change3]
                    }
                } while (change3 in order)
                
            } else if (change2 == 'modify') {
                do {
                    change3 = parseInt(prompt('What is the ID of the item you want to modify?: '))
                    if (!(change3 in order)) {
                        console.log('Invalid ID')
                    } else {
                        let newQuant = parseInt(prompt('How much do you want?: '))
                        order[change3].quantity = newQuant
                    }
                } while (!(change3 in order))
            } else {
                console.log('Invalid Option')
            }
        } while (change2 != 'delete' && change2 != 'modify')
    } else if (change == 'no') {

    }
}
main_function();
