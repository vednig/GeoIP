var express = require('express')
var app = express()
const fs = require('fs');
const Reader = require('@maxmind/geoip2-node').Reader;

app.get('/', function (req, res) {
  const dbBuffer =fs.readFileSync('static/GeoLite2-City.mmdb')
  const reader =Reader.openBuffer(dbBuffer)
  var ip = req.headers['x-forwarded-for'] ||
     req.socket.remoteAddress ||
     null;
  //response=reader.city('2405:201:30O04:4d4b:d5e2:29da:a00e:5b42')
  res.send(req.socket.remoteAddress)
  
})

app.listen(8080, function () {
  console.log('Listening on port 8080...')
})
