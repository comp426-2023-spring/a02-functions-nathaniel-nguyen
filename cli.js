#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from "node-fetch";

// Parse command-line arguments
var arg = minimist(process.argv.slice(2));

// Show help message and exit if -h option is provided
if (arg.h) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n    -h            Show this help message and exit.\n    -n, -s        Latitude: N positive; S negative.\n    -e, -w        Longitude: E positive; W negative.\n    -z            Time zone: uses tz.guess() from moment-timezone by default.\n    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n    -j            Echo pretty JSON from open-meteo API and exit.\n");
    process.exit(0);
}

// Extract latitude and longitude values from command-line arguments
const lat = arg.n ? Math.round(arg.n * 100) / 100 : arg.s ? -Math.round(arg.s * 100) / 100 : undefined;
const long = arg.e ? Math.round(arg.e * 100) / 100 : arg.w ? -Math.round(arg.w * 100) / 100 : undefined;

// Determine the timezone to use
const timezone = arg.z ?? moment.tz.guess();

// Fetch weather data from open-meteo API
const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&daily=precipitation_hours&current_weather=true&timezone=" + timezone);

// Get the data from the response
const data = await response.json();

// Output the JSON data if -j option is provided
if (arg.j) {
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
}

// Determine the number of days to retrieve weather information
const days = arg.d ?? 1;

// Determine the day phrase based on the number of days
const string = days == 0 ? "today." : days > 1 ? "in " + days + " days." : "tomorrow.";

// Check if precipitation is expected for the specified day
if (data.daily.precipitation_hours[days] > 0) {
    console.log(`There will be rain ${string}`);
} else {
    console.log(`There will be no rain ${string}`);
}