#!/user/bin/env node

import minimist from 'minimist';
import node from 'node-fetch';
import moment from 'moment-timezone';

// process argument using the minimist function we just imported

const arg = minimist(process.argv.slice(2));

// create the help text

if (arg.h) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE    -h            Show this help message and exit.    -n, -s        Latitude: N positive; S negative.    -e, -w        Longitude: E positive; W negative.    -z            Time zone: uses tz.guess() from moment-timezone by default.    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.    -j            Echo pretty JSON from open-meteo API and exit.");
    process.exit(0);
}

const lat = arg.n || -1 * (arg.s);
const long = arg.e || -1 * (arg.w);

const timezone = moment.tz.guess();

const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&daily=weathercode,temperature_2m_max,precipitation_hours,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timezone=" + timezone);

// Get the data from the request
const data = await response.json();

if (arg.j) {
	console.log(data);
	process.exit(0);
}

const days = arg.d 

if (arg.d == null) {
	days = 1;
} else {
	days = arg.d;
}

let weather = "";
if (data.daily.precipitation_hours[days] > 0) {
	weather += "There will be rain ";
} else {
	weather += "There will be sun ";
}

if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}