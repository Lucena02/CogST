const API_KEY = "YOUR_API_KEY";


export function writeStats(url) {
    const regex = /\/\w+\//g;
    const matches = url.match(regex);
    console.log(matches);
}