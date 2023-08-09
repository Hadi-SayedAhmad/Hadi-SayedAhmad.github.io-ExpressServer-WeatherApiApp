const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    console.log("Post Request Recieved!");
    const apiKey = "c830ed7c2ceca16fbbb35dcaafab0e28";
    var query = req.body.country;
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units + "#";

    https.get(url, function (response) {

        // console.log(response.statusCode);

        response.on("data", function (data) { // this is the https response
            //response.on("data", function(data) { ... }) is an event listener that listens for the "data" event on the response object. This is commonly used when dealing with streams, such as when making HTTP requests in Node.js.

            const weatherData = JSON.parse(data); // parsing hexadecimal data to a javascript readable object!
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon; // this is not enough... this is only the name of the icon, we need the image also... this is done using their url:
            const iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
            // console.log(temp);
            // console.log(description);
            res.write("<h1> The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
            res.write("<p> It's " + description + " today! </p>");
            res.write("<img src=" + iconURL + ">");
            res.send();

            /* we use .write() if we want to send multiple html lines */

        });

    });
})



app.listen(3000, () => {
    console.log("Server is now running on port 3000");
});