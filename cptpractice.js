const prompt = require('prompt-sync')();

// Function to print the list (DRY Principle)
function printList(list) {
    for (let i = 0; i < list.length; i++) {
        console.log(list[i]);
    }
}

// Function to find the position of a username in the list
function findIndex(list, username) {
    return list.indexOf(username);
}

// Define a list of usernames
var usernames = [
    "mystic_shadow42",
    "lunar_eclipse_x",
    "crimson_falcon",
    "pixel_nomad",
    "quantum_flux",
    "nebula_rider",
    "solar_scribe",
    "phantom_echo",
    "turbo_wolf77",
    "echo_blaze",
    "cyber_phoenix",
    "frost_byte88",
    "nova_trail",
    "aqua_rebel",
    "iron_sparrow",
    "zenith_arrow",
    "stealth_wraith",
    "blaze_hunter",
    "glitch_mage",
    "obsidian_pulse",
    "warped_vision",
    "chaos_drifter",
    "skybound_soul",
    "arctic_comet",
    "shadow_circuit"
];

function search(key_user) {
    var found = false;
    // Loop until the username is found
    do {
        if (usernames.includes(key_user)) {
            index = findIndex(usernames, key_user);
            found = true;
        } else {
            console.log('Username not found. Try again.');
            key_user = prompt('USERNAME? ');
        }
    } while (!found);
    return index;
}

// Function to add a username at a specific position
function addPosition(list, username, position) {
    list.splice(position, 0, username);
    return list;
}

// Function to remove the first element from the list
function removeFirst(list) {
    list.shift();
    return list;
}

// Function to remove the last element from the list
function removeLast(list) {
    list.pop();
    return list;
}

// Function to add a username to the end of the list
function addEnd(list, username) {
    list.push(username);
    return list;
}

// Function to sort the list in ascending or descending order
function sortList(list, order) {
    if (order == 'descending') {
        list.sort().reverse();
    } else {
        list.sort();
    }
    return list;
}

// Function to create a copy of the list
function copyList(list) {
    let copy = list.slice();
    return copy;
}

// Function to exit the program
function exitProgram(temp) {
    temp = true;
    console.log('Goodbye!');
    return temp;
}

// Main Program
function main() {
    usernames.sort();
    let done = false;
    printList(usernames);
    while (!done) {
        // Display menu options
        console.log('A - Search');
        console.log('B - Add to specific position');
        console.log('C - Remove first element');
        console.log('D - Remove last element');
        console.log('E - Add to end of list');
        console.log('F - Sort');
        console.log('G - Copy');
        console.log('H - Exit');
        var choice = prompt('Enter choice: ');
        if (choice.toLowerCase() == 'a') {
            let key_user = prompt('USERNAME? ');
            let index = search(key_user);
            console.log(`${key_user} is at position ${index}`);
        } else if (choice.toLowerCase() == 'b') {
            let new_user1 = prompt('NEW USERNAME? ');
            let position = prompt('POSITION? ');
            addPosition(usernames, new_user1, position);
            printList(usernames);
        } else if (choice.toLowerCase() == 'c') {
            removeFirst(usernames);
            printList(usernames);
        } else if (choice.toLowerCase() == 'd') {
            removeLast(usernames);
            printList(usernames);
        } else if (choice.toLowerCase() == 'e') {
            let new_user3 = prompt('NEW USERNAME? ');
            addEnd(usernames, new_user3);
            printList(usernames);
        } else if (choice.toLowerCase() == 'f') {
            let order;
            do {
                order = prompt('Sort order (ascending/descending)? ').toLowerCase();
                if (order != 'ascending' && order != 'descending') {
                    console.log('Invalid input. Please enter "ascending" or "descending".');
                }
            } while (order != 'ascending' && order != 'descending');
            sortList(usernames, order);
            printList(usernames);
        } else if (choice.toLowerCase() == 'g') {
            let copyChoice = prompt('Copy full list or part of the list (full/part)? ').toLowerCase();
            if (copyChoice == 'full') {
                let copiedList = copyList(usernames);
                console.log('Copied List:');
                printList(copiedList);
            } else if (copyChoice == 'part') {
                let start = parseInt(prompt('Start index? '));
                let end = parseInt(prompt('End index? '));
                if (start >= 0 && end < usernames.length && start <= end) {
                    let copiedList = usernames.slice(start, end + 1);
                    console.log('Copied List:');
                    printList(copiedList);
                } else {
                    console.log('Invalid indexes. Try again.');
                }
            } else {
                console.log('Invalid choice. Please enter "full" or "part".');
            }
        } else if (choice.toLowerCase() == 'h') {
            done = exitProgram();
        }
    }
}
main();

