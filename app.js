var http = require('http');
var Canvas = require('canvas');
var echarts = require('echarts');

var port = process.env.PORT || 3000;

function queryString(url) {
    var queryIndex = url.indexOf("?");
    if (!url) {
        return null;
    }
    var search = url;
    if (queryIndex != -1) {
        search = url.substr(queryIndex + 1);
    }
    search = search.replace(/^\?/, "");
    var pairs = search.split('&');
    var queryObject = {};
    for (var pair of pairs) {
        if (pair === '') {
            continue;
        }
        var parts = pair.split(/=(.+)?/),
            key = parts[0].toLowerCase(),
            value = parts[1] && decodeURIComponent(parts[1].replace(/\+/g, ' '));
        var existing = queryObject[key];
        if (existing) {
            if (toString.call(existing) == "[object Array]") {
                existing.push(value);
            } else {
                queryObject[key] = [existing, value];
            }
        } else {
            queryObject[key] = value;
        }
    }
    return queryObject;
}

function createImage(width, height, option) {
    return new Promise((resolve) => {
        echarts.setCanvasCreator(() => {
            return ctx;
        });
        var ctx = Canvas.createCanvas(parseInt(width), parseInt(height));
        var chart;
        option.animation = false;
        chart = echarts.init(ctx);
        chart.setOption(option);
        var buffer = chart.getDom().toBuffer();
        resolve(buffer);
        chart.dispose();
    })
}

http.createServer((req, res) => {
    if (req.method == "POST") {
        var qs = queryString(req.url);
        var bodyStr = "",
            width = qs.w || '800',
            height = qs.h || '600';
        req.on('data', (chunk) => {
            bodyStr += chunk;
        });
        req.on('end', () => {
            var option = JSON.parse(bodyStr);
            createImage(width, height, option).then((buffer) => {
                res.writeHead(200, {'Content-Type': 'image/png'});
                res.end(buffer);
            });
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
    }
}).listen(port, () => {
    console.log("Server is running at:0.0.0.0:" + port);
});
