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