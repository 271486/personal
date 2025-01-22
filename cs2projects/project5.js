// Function to print the list (DRY Principle)
function printList(list) {
    for (let i = 0; i < list.length; i++) {
        console.log(list[i]);
    }
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

// Sort the usernames list in ascending order
usernames.sort();

// Print the sorted list
console.log('Sorted list');
printList(usernames);
console.log('\n');

const prompt = require('prompt-sync')();
var done = false;
var i = 0;
while (!done) {
    var key_user = prompt('USERNAME? ');
    // Check if the username exists in the list
    if (usernames.includes(key_user)) {
        i = usernames.indexOf(key_user)
        // Print the username and its position
        console.log(key_user + ' at position ' + i)
        // Set done to true to exit the loop
        done = true
    } else {
        // Print an error message if the username is not found
        console.log('Username not found. Try again.');
    };
};

// Get a new username from the user
var new_user = prompt('NEW USERNAME? ').toLowerCase();
var new_pos;
do {
    // Get the position from the user
  new_pos = prompt(`Enter position (0 - ${usernames.length}) `);
    // Check if the position is within the valid range
  if (new_pos < 0 || new_pos > usernames.length) {
        // Print an error message if the position is invalid
    console.log(`Invalid position. Please choose a position between 0 and ${usernames.length}.`);
  };
} while (new_pos < 0 || new_pos > usernames.length);
// Insert the new username at the given position
usernames.splice(new_pos, 0, new_user);
console.log('\n');
console.log('Updated list:');
// Print the updated list
printList(usernames);
console.log('\n');
console.log('Removing first value from list');
// Remove the first element from the list
usernames.shift();
console.log('\n');
console.log('List after shifting:');
// Print the list after removing the first element
printList(usernames);
console.log('\n');
console.log('Removing last value from list');
// Remove the last element from the list
usernames.pop();
console.log('\n');
console.log('List after popping:');
// Print the list after removing the last element
printList(usernames);
do {
    // Get a new username from the user
    var new_user2 = prompt('What username do you want to add to the end of the list? ');
    // Check if the username is null
    if (new_user2 == '') {
        // Print an error message if the username is empty
        console.log('Please enter a username.');
    } else {
        // Append the new username to the end of the list
    usernames.push(new_user2);
    console.log('\n');
    }
} while (new_user2 == '');
console.log('Updated list:');
// Print the updated list
printList(usernames);
var sort_order;
do {
    sort_order = prompt('Sort in ascending or descending order? ');
    if (sort_order.toLowerCase() == 'ascending') {
        // Sort the list in ascending orderp
    usernames.sort();
    } else if (sort_order.toLowerCase() == 'descending') {
        // Sort the list in descending order
    usernames.sort().reverse();
} else {
        // Print an error message if the sort order is invalid
        console.log('Invalid input. Enter ascending or descending.');
    };
} while (sort_order.toLowerCase() !== 'ascending' && sort_order.toLowerCase() !== 'descending');

// Print the final list
console.log('\n');
console.log('Final list: \n');
printList(usernames);
// Copying list
do {
    copy_choice = prompt('Do you want to copy the full list or a part of the list? (full/part) ');
    if (copy_choice.toLowerCase() == 'full') {
        // Copy the full list
        var copied_list = usernames;
    } else if (copy_choice.toLowerCase() == 'part') {
        var start;
        do {
            // Get the start position from the user
            start = parseInt(prompt(`Enter starting position (0 - ${usernames.length - 1}) `));
            // Check if the start position is valid
            if (start < 0 || start > usernames.length - 1) {
                // Print an error message if the start position is invalid
                console.log(`Invalid position. Please choose a position between 0 and ${usernames.length - 1}.`);
            };
        } while (start < 0 || start > usernames.length - 1);
        var end;
        do {
            // Get the end position from the user
            end = parseInt(prompt(`Enter ending position (${start} - ${usernames.length - 1}) `));
            // Check if the end position is valid
            if (end < start || end > usernames.length - 1) {
                // Print an error message if the end position is invalid
                console.log(`Invalid position. Please choose a position between ${start} and ${usernames.length - 1}.`);
            };
        } while (end < start || end > usernames.length - 1);
        // Copy a part of the list
        var copied_list = usernames.slice(start, end + 1);
    } else {
        // Print an error message if the choice is invalid
        console.log('Invalid input. Please enter full or part.');
    }
} while (copy_choice.toLowerCase() != 'full' && copy_choice.toLowerCase() != 'part');

// Print the copied list
console.log('\n');
console.log('Copied list: \n');
printList(copied_list);
