'use strict';
// GLOBALS 

// Line 10-12: The code declares 3 global variables:

// pictureArray: an array to store RandomImage objects
// votingRounds: an integer representing the number of voting rounds available
// preIndex: an array to store the index of the last 3 images displayed

let pictureArray = [];
let votingRounds = 25;
let preIndex = [-1, -1, -1];


// DOM WINDOWS

// Line 24-32: The code declares 6 DOM window variables to access HTML elements with the same id as the value:

// imgContainer: the container of all images
// imgOne, imgTwo, imgThree: the three images displayed to the user for voting
// resultsBtn: the button to show the results
// canvasElem: the canvas for displaying the results chart

let imgContainer = document.getElementById('img-container');

let imgOne = document.getElementById('img-one');
let imgTwo = document.getElementById('img-two');
let imgThree = document.getElementById('img-three');


let resultsBtn = document.getElementById('show-results-btn');
let canvasElem = document.getElementById('myChart');

// CONSTRUCTOR FUNCTION

// Line 38-44: The code declares a constructor function for RandomImage objects that takes in 2 parameters: name and imgExtension. The function initializes 4 properties: name, img, votes, and views. The img property is a string that combines the name and imgExtension to create the full image path.

function RandomImage(name, imgExtension = 'jpg') {
  this.name = name;
  this.img = `img/${name}.${imgExtension}`;
  this.votes = 0;
  this.views = 0;

}

// HELPER FUNCTIONS / UTILITIES 

// Line 50-51: The code declares a randomIndex() function that returns a random integer from 0 to the length of the pictureArray minus 1.

function randomIndex() {
  return Math.floor(Math.random() * pictureArray.length);
}

// Line 56-92: The code declares a renderImg() function to display three random images to the user. The function first generates 3 random indices for each image using the randomIndex() function. Then, the function uses a while loop to validate that the 3 indices are unique and not the same as the previous 3 indices stored in the preIndex array. The function sets the source, title, and alt attributes of each image to the corresponding properties of the RandomImage object at the corresponding index in the pictureArray. It also increments the views property of each RandomImage object by 1.

function renderImg() {
  let imgOneIndex = randomIndex();
  let imgTwoIndex = randomIndex();
  let imgThreeIndex = randomIndex();

  // Validation to make sure numbers are unique
  while (preIndex.includes(imgOneIndex) || imgOneIndex === imgTwoIndex || imgOneIndex === imgThreeIndex) {
    imgOneIndex = randomIndex();
  }

  while (preIndex.includes(imgTwoIndex) || imgOneIndex === imgTwoIndex || imgTwoIndex === imgThreeIndex) {
    imgTwoIndex = randomIndex();
  }

  while (preIndex.includes(imgThreeIndex) || imgThreeIndex === imgTwoIndex || imgOneIndex === imgThreeIndex) {
    imgThreeIndex = randomIndex();
  }

  preIndex[0] = imgOneIndex;
  preIndex[1] = imgTwoIndex;
  preIndex[2] = imgThreeIndex;
  console.log(preIndex);

  imgOne.src = pictureArray[imgOneIndex].img;
  imgTwo.src = pictureArray[imgTwoIndex].img;
  imgThree.src = pictureArray[imgThreeIndex].img;
  imgOne.title = pictureArray[imgOneIndex].name;
  imgOne.alt = `this is an image of ${pictureArray[imgOneIndex].name}`;
  imgTwo.title = pictureArray[imgTwoIndex].name;
  imgTwo.alt = `this is an image of ${pictureArray[imgTwoIndex].name}`;
  imgThree.title = pictureArray[imgThreeIndex].name;
  imgThree.alt = `this is an image of ${pictureArray[imgThreeIndex].name}`;

  pictureArray[imgOneIndex].views++;
  pictureArray[imgTwoIndex].views++;
  pictureArray[imgThreeIndex].views++;
}

// Line 96-134: The code declares a renderChart() function to display the results of the voting. The function first declares 3 arrays: pictureName, pictureVotes, and pictureViews. It uses a for loop to fill each array with the corresponding properties from the RandomImage objects stored in the pictureArray. The function then creates a chart object with type 'bar', data, and options properties and uses the Chart library to create a chart with this object.

function renderChart() {
  let pictureName = [];
  let pictureVotes = [];
  let pictureViews = [];

  for (let i = 0; i < pictureArray.length; i++) {
    pictureName.push(pictureArray[i].name);
    pictureVotes.push(pictureArray[i].votes);
    pictureViews.push(pictureArray[i].views);
  }

  let chartObj = {
    type: 'bar',
    data: {
      labels: pictureName,
      datasets: [{
        label: '# of Votes',
        data: pictureVotes,
        borderWidth: 1

      },
      {
        label: '# of Views',
        data: pictureViews,
        borderWidth: 1

      }]
    },
    options: {indexAxis: 'y',
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  new Chart(canvasElem, chartObj);
}

// EVENT HANDLERS

// Line 140-160: The code declares a handleClick() function to handle the click event on the images. The function first retrieves the title of the clicked image and uses a for loop to find the corresponding RandomImage object in the pictureArray. It increments the votes property of the RandomImage object by 1 and decrements the votingRounds by 1. The function calls the renderImg() function to display the next set of images and checks if the votingRounds equals 0. If so, it removes the click event handler on the imgContainer. The function also stringifies the pictureArray and stores it in local storage under the key 'myPictures'.

function handleClick(event) {

  let imgClicked = event.target.title;

  for (let i = 0; i < pictureArray.length; i++) {
    if (imgClicked === pictureArray[i].name) {
      pictureArray[i].votes++;
    }
  }

  votingRounds--;
  renderImg();
  if (votingRounds === 0) {
    imgContainer.removeEventListener('click', handleClick);
  }

  let stringifiedPictures = JSON.stringify(pictureArray);
  localStorage.setItem('myPictures', stringifiedPictures);
  console.log('Stringified data', stringifiedPictures);

}

// Line 164-168: The code declares a handleResults() function to handle the click event on the results button. The function checks if the votingRounds equals 0 and calls the renderChart() function to display the results if so.

function handleResults() {
  if (votingRounds === 0) {
    renderChart();
  }
}
// EXECUTABLE CODE 

// Line 173-end: The code uses local storage to retrieve the stored pictureArray from a previous session, if any, and assigns it to a variable parsedData. If parsedData is not null, the code assigns it to the pictureArray. If parsedData is null, the code creates a new array of RandomImage objects and assigns it to the pictureArray. The code then adds the click event handler on the imgContainer to call the handleClick() function and the click event handler on the resultsBtn to call the handleResults() function. 

let storedPictures = localStorage.getItem('myPictures');
let parsedData = JSON.parse(storedPictures);

if (storedPictures) {
  pictureArray = parsedData;
} else {
  let bag = new RandomImage('bag');
  let banana = new RandomImage('banana');
  let bathroom = new RandomImage('bathroom');
  let boots = new RandomImage('boots');
  let breakfast = new RandomImage('breakfast');
  let bubblegum = new RandomImage('bubblegum');
  let chair = new RandomImage('chair');
  let cthulhu = new RandomImage('cthulhu');
  let dogDuck = new RandomImage('dog-duck');
  let dragon = new RandomImage('dragon');
  let pen = new RandomImage('pen');
  let petSweep = new RandomImage('pet-sweep');
  let scissors = new RandomImage('scissors');
  let shark = new RandomImage('shark');
  let sweep = new RandomImage('sweep', 'png');
  let tauntaun = new RandomImage('tauntaun');
  let unicorn = new RandomImage('unicorn');
  let waterCan = new RandomImage('water-can');
  let wineGlass = new RandomImage('wine-glass');

  pictureArray.push(bag, banana, bathroom, boots, breakfast, bubblegum, chair, cthulhu, dogDuck, dragon, pen, petSweep, scissors, shark, sweep, tauntaun, unicorn, waterCan, wineGlass);
}

renderImg();

imgContainer.addEventListener('click', handleClick);
resultsBtn.addEventListener('click', handleResults);