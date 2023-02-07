// Constructor function to create an object for each product
function Product(name, filePath) {
  this.name = name;
  this.filePath = filePath;
  this.timesShown = 0;
  this.timesClicked = 0;
  Product.all.push(this);
}

// Property attached to the constructor function to keep track of all the products
Product.all = [];

// Variable to hold the number of rounds
var rounds = 25;

// Function to generate three unique products and display them
function displayProducts() {
  var products = getThreeUniqueProducts();
  products.forEach(function(product) {
    product.timesShown++;
    // Display the product in the HTML
  });
}

// Function to get three unique products
function getThreeUniqueProducts() {
  var products = [];
  while (products.length < 3) {
    var randomIndex = Math.floor(Math.random() * Product.all.length);
    var product = Product.all[randomIndex];
    if (!products.includes(product)) {
      products.push(product);
    }
  }
  return products;
}

// Event listener to listen for the product selection
document.getElementById("products").addEventListener("click", function(event) {
  if (event.target.tagName === "IMG") {
    var productName = event.target.alt;
    var product = Product.all.find(function(product) {
      return product.name === productName;
    });
    product.timesClicked++;
    rounds--;
    if (rounds > 0) {
      displayProducts();
    } else {
      // Remove the event listener
      document.getElementById("products").removeEventListener("click");
      // Show the results button
    }
  }
});

// Function to show the results
function showResults() {
  // Loop through all the products and display the results
}
