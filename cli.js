#!/user/bin/env node

import minimist from 'minimist';
import node from 'node-fetch';
import moment from 'moment-timezone';

// Import required modules

// process argument using the minimist function we just imported
const arg = minimist(process.argv.slice(2));

// create the help text
if (arg.h) {
	console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit`);
	process.exit(0);
}

// Guess the timezone using moment-timezone
const timezone = moment.tz.guess();

// Extract latitude and longitude values from command-line arguments
const latitude = -1 * (arg.s) || arg.n;
const longitude = -1 * (arg.w) || arg.e;

// Fetch weather data from open-meteo API
const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&daily=precipitation_hours&current_weather=true&timezone=" + timezone);

// Get the data from the request
const data = await response.json();

// Check if -j option is specified to output JSON data
if (arg.j) {
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
}

// Set the number of days to retrieve weather information
let days;
if (arg.d == null) {
    days = 1; // Default to 1 day if -d option is not provided
} else {
    days = arg.d;
}

let forecast = "";

// Determine forecast condition based on precipitation hours
if (data.daily.precipitation_hours[days] > 0) {
    forecast += "There will be rain ";
} else {
    forecast += "There will be sun ";
}

// Output the appropriate day information
if (days == 0) {
    forecast += "today.";
} else if (days > 1) {
    forecast += "in " + days + " days.";
} else {
    forecast += "tomorrow.";
}

console.log(forecast);
