//to read and set any environment variables with dotenv package
require("dotenv").config();

//to require all the important packages
var keys = require("./keys.js");
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");

//to get key information
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//to take in command line arguments
var nodeArgs = process.argv;

//to take in specific commands, e.g. 'my tweets'
var liriCommand = nodeArgs[2];
var liriInput = nodeArgs.slice(3).join(" ");


//for movie name
var movieName = "";

//for song name
var songName = "";

var defaultSong = "The Sign ace of base";

//----------------------------------------------------------------------

//if-then conditions to call on specific functions
if (liriCommand === "my-tweets") {
    showTweets();
}
else if (liriCommand === "spotify-this-song") {
    if (!liriInput){
        songInfo(defaultSong);
    } else{
    songInfo(liriInput);
    }
}
else if (liriCommand === "movie-this") {
    movieInfo(liriInput);
}
else if (liriCommand === "do-what-it-says") {
    liriDoThis();
}

//-------------------------------------------------------------------------------

//TWITTER FUNCTION
function showTweets() {
    var params = { screen_name: 'AB' };
    client.get('statuses/user_timeline', { count: 20 }, function (error, tweets, response) {
        if (error) {
            throw error;
        }
        // append to log.txt

        for (var i = 0; i < tweets.length; i++) {
            var logResults =
                `
            Here are my latest Tweets:
            Tweet #: ${i + 1}
            Tweet Text: ${tweets[i].text}
            Created At: ${tweets[i].created_at}

            `
            log(logResults);
        }

        //print to the console
        for (var i = 0; i < tweets.length; i++) {
            console.log("\r\nMy Lastest Tweets: ")
            console.log("Tweet #: ", i + 1);
            console.log("Tweet Text: ", tweets[i].text);
            console.log("Created At: ", tweets[i].created_at);
            console.log("---------------------------------------------------------------------------------------")
        }

    });

}

//-------------------------------------------------------------------------------------------------
//SPOTIFY FUNCTION
function songInfo(songName) {

    
    //Search method
    spotify.search({ type: 'track', query: songName, limit: 5 }, function (err, data) {
        if (err) {
            return console.log(err);


        } else {

         // print to log.txt
        for (var i = 0; i < data.tracks.items.length; i++) {
            var songRec = data.tracks.items[i];
            var prevSong = songRec.preview_url;
            if (prevSong === null) {
                 prevSong = "Preview Not Available"
             }

            var logResults = `
            You have been Spotified!
            Song Number: ${i + 1}
            Artist(s): ${songRec.artists[0].name}
            Preview Link: ${prevSong}
            Album name: ${songRec.album.name}
            
            `
            log(logResults);
            }


            // print to console
            console.log("You have been Spotified!");


            for (var i = 0; i < data.tracks.items.length; i++) {
                var songRec = data.tracks.items[i];
                var prevSong = songRec.preview_url;
                if (prevSong === null) {
                    prevSong = "Preview Not Available"
                }
                console.log("\r\nSong Number: ", i + 1);

                console.log("Artist(s): ", songRec.artists[0].name);
                console.log("Song Name: ", songRec.name);
                console.log("Preview Link: ", prevSong);
                console.log("Album name: ", songRec.album.name);
                // console.log("------------------------------------------------------------------------------------------------------------")


            }

        }
    });
}
//----------------------------------------------------------------------------------------------------------------------
//OMBD FUNCTION

function movieInfo(movieName) {

    //variable to hold the link to the  OMBD API
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";
    console.log("\n-------------------------------------\n")

    //If movie name hasn't been provided
    if (!movieName) {
        console.log("If you haven't watched 'Mr. Nobody,' then you should at: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    }

    else {

        //Run Request
    request(queryUrl, function (error, response, body) {
            // var tomatoRating = JSON.parse(body).Ratings[1].Value;
         if (!error && response.statusCode === 200) {
             var plot = JSON.parse(body).Plot
            if (JSON.parse(body).Plot === "N/A") {
                    console.log(plot + "Sorry! The plot for this movie is not available.");
             }
            //print to log.txt
            var logResults = `
            Movie Title: ${JSON.parse(body).Title}
            Year Released: ${JSON.parse(body).Year}
            IMDB Rating (out of 10):  ${JSON.parse(body).imdbRating}
            Rotten Tomatoes Rating (out of 100%):  ${JSON.parse(body).tomatoRating}
            Language: ${JSON.parse(body).Language}
            Plot: ${plot}
            Actors: ${JSON.parse(body).Actors}
                
             `

            //print to console
             console.log("Movie Title: " + JSON.parse(body).Title);
             console.log("Year Released: " + JSON.parse(body).Year);
             console.log("IMDB Rating (out of 10): " + JSON.parse(body).imdbRating);
             console.log("Rotten Tomatoes Rating (out of 100%): " + JSON.parse(body).tomatoRating);
             console.log("Language: " + JSON.parse(body).Language);
             console.log("Plot: " + JSON.parse(body).Plot);
            if (JSON.parse(body).Plot === "N/A") {
                console.log(JSON.parse(body).Plot + "Sorry! The plot for this movie is not available.");
            }
            console.log("Actors: " + JSON.parse(body).Actors);

            }

            log(logResults);

        });

    }

}

//-----------------------------------------------------------------------------------------------------------
//DO-WHAT-IT-SAYS

function liriDoThis() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);

        }
        else {

            // console.log(data);
            var dataArr = data.split(",");
            console.log(dataArr);

            songInfo(dataArr[1]);
            
            
        

        }
    })
}

//----------------------------------------------------------------------------------------------------------------
//LOG FUNCTION

function log(logResults) {
    fs.appendFile("log.txt", logResults, function (error) {
        if (error) {
            throw error;
        } else {
            console.log("\r\nYou search results have been stored!")
        }

    });
}

