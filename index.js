// Import Firebase app initialization and database functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

// Firebase app settings including the database URL
const appSettings = {
    databaseURL: "https://add-cart-5c53a-default-rtdb.firebaseio.com/" // my database URL
}//https://add-cart-5c53a-default-rtdb.firebaseio.com//


const app = initializeApp(appSettings);


const database = getDatabase(app);


const shoppingListInDB = ref(database, "shoppingList");

// Get references to HTML elements
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

// Event listener for the "Add" button click
addButtonEl.addEventListener("click", function() {
    // Get the trimmed value from the input field
    let inputValue = inputFieldEl.value.trim();
    
    // Check if the input value is not empty
    if (inputValue !== "") {
        // Push the input value to the database
        push(shoppingListInDB, inputValue);
        // Clear the input field
        clearInputEl();
    }
});

// Listen for changes in the "shoppingList" node in the database
onValue(shoppingListInDB, function(snapshot) {    
    // Check if the snapshot contains data
    if (snapshot.exists()) {
        // Convert the snapshot data to an array of items
        let itemsArray = Object.entries(snapshot.val());
    
        // Clear the current shopping list display
        clearShoppingListEl();
        
        // Loop through each item in the array
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            // Append the item to the shopping list display
            appendItemToShoppingListEl(currentItem);
        } 
    } else {
        // Display a message if no items are in the list
        shoppingListEl.innerHTML = "No items in list... yet";
    }
});

// Function to clear the shopping list display
function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

// Function to clear the input field
function clearInputEl() {
    inputFieldEl.value = "";
}

// Function to append an item to the shopping list display
function appendItemToShoppingListEl(item) {
    // Extract the item ID and value
    let itemID = item[0];
    let itemValue = item[1];
    
    // Create a new list item element
    let newEl = document.createElement("li");
    
    // Set the text content of the new element to the item value
    newEl.textContent = itemValue;
    
    // Add an event listener to the new element for item removal
    newEl.addEventListener("click", function() {
        // Get a reference to the exact location of the item in the database
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        // Remove the item from the database
        remove(exactLocationOfItemInDB);
    });
    
    // Append the new element to the shopping list display
    shoppingListEl.append(newEl);
}
