var express = require('express')
var app = express()
const fs = require('fs');
const Reader = require('@maxmind/geoip2-node').Reader;
var ip = require('ip');
const random = require('random')
var requestIp = require('request-ip');
const Redis = require('ioredis');
//const client = redis.createClient({
//    host: 'redis-13206.c267.us-east-1-4.ec2.cloud.redislabs.com',
//    port: 13206,
//    password: 'RIb6PnjsaMarOSE04aJEvnkSwmpkvri3'
//});
//
//client.on('error', err => {
//    console.log('Error ' + err);
//});
//client.end(true);
app.get('/',function(req,res){
res.send('<h3 style="font-family:Sans-Serif">GeoIP API</h3><hr> <br>:: Get your key at <a href="/key">/key</a><br>:: then send request at /api/your-key')
});
app.get('/api/:apikey', function (req, res) {
const redis = new Redis({
port:13206,
host:"redis-13206.c267.us-east-1-4.ec2.cloud.redislabs.com",
password:"RIb6PnjsaMarOSE04aJEvnkSwmpkvri3",
//db:10840797
});
var clientIp = requestIp.getClientIp(req);
console.log(clientIp);

verifykey=redis.get(req.params.apikey).then(
function(resp){
//console.log(response)
currenttimestamp=new Date().getTime()
time=currenttimestamp-response
//console.log(time)
if (time>=1800000){
res.send( 'Error: Key Timed Out' );
//console.log('Error: Timed Out')
return;
}else{
res.send(response)
return}
return;
});
const dbBuffer =fs.readFileSync('./static/GeoLite2-City.mmdb')
const reader =Reader.openBuffer(dbBuffer)
//var cip = req.headers['X-Client-IP'] || req.headers['x-forwarded-for'] ||
//     req.socket.remoteAddress ||
//     null;
ips=clientIp
//console.log(ips)
response=reader.city(ips)
redis.quit() 
//console.log(value)
//res.send(response)



//redis.quit()
//res.send('Key Error Try Again');
//redis.quit()  
})
app.get('/key',function( req, res){
const unique_id = random.int(1000000000000,10000000000000).toString(36)
console.log(unique_id);
var timestamp = new Date().getTime();

const redis = new Redis({
port:13206,
host:"redis-13206.c267.us-east-1-4.ec2.cloud.redislabs.com",
password:"RIb6PnjsaMarOSE04aJEvnkSwmpkvri3",
//db:10840797
})
//.createClient({
//url: 'redis://RIb6PnjsaMarOSE04aJEvnkSwmpkvri3@redis-13206.c267.us-east-1-4.ec2.cloud.redislabs.com:13206/10840797',
//socket:{keepAlive:5000},
//});
//client.connect()
//s=client.ping();
//console.log(s)
redis.set(unique_id, timestamp)
// (err, reply) => {
//    if (err) throw err;
//    console.log(reply)
//})
//client.quit();

//client.disconnect();
redis.quit()

res.send(unique_id)
})
app.get('/v4', function (req, res) {
  const dbBuffer =fs.readFileSync('static/GeoLite2-City.mmdb')
  const reader =Reader.openBuffer(dbBuffer)
  var cip = req.headers['x-forwarded-for'] ||
     req.socket.remoteAddress ||
     null;
  ips=cip.split(", ")
 if(ip.isV4Format(ips[0])==true){
 // console.log(ips)
response=reader.city(ips[0])
}else{
response=reader.city(ips[1])
}
  res.send(response)

})


app.listen(8080, function () {
  console.log('Listening on port 8080...')
})
