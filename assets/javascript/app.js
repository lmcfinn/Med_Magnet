// hint for the HW: q, limit, rating

var topics = ['koala', 'kangaroo', 'platypuses'];

var api = "http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC";
var apiKey = "&api_key=dc6zaTOxFJmzC";
var query = "&q=" 


// /v1/gifs / search
// api.giphy.com

var searchBar = document.getElementById("searchBar");
console.log(searchBar);

var magnifyingGlass = document.getElementsByClassName("input-group-addon");

function printText(){
  console.log(this)
  console.log(this.text)
}

// class='xOut'
// id='searchBar'


// function printGiphy() {
//     print();
//     var url = api + apiKey + query
// };

// loadJASON(url, gotData);

// function gotData(data) {
//     data.data.[0].images.orgininals.url
// };

// When user clicks the search button a button with the word searched for will appear 
// underneath the search bar as a deletable button.  The search should automatically 
// print 6 images each time an item is searched. 

// When you x out a word searched, it will delete all the giphies associated with it.
