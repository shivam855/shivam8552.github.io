const http = require("http");
const fs = require("fs");

const homeHtmlFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    // console.log(orgVal.main.temp);
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);

    return temperature;
    // console.log(temperature);
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        var requests = require('requests');
        requests('https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=0aa7e5fcbc4d0336a346a6b29390b944')
            .on('data', (chunk) => {
                const chunkData = JSON.parse(chunk);
                const arrData = [chunkData];
                // console.log(arrData);
                const realTimeData = arrData.map((val) =>  replaceVal(homeHtmlFile,val)).join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
});

server.listen(8001, "127.0.0.1", () => {
    console.log("local host running!!!");
})
