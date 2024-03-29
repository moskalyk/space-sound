const accountSid = 'AC79fdf699e64723f19756fb9df961697e';
const authToken = 'e2487ce2398c52c691e34b11966bca25';
const client = require('twilio')(accountSid, authToken);
const hypercore = require('hypercore');
const feed = hypercore('./numbers', {valueEncoding: 'json'})

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const PORT = 8080;
const moment = require('moment');
const path = require('path');
const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const app = express();
const cron = require("node-cron");

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/my-app/build')));

let callbackUrl;

if(process.env.NODE_ENV =='local'){
    callbackUrl = 'http://2b102c9a.ngrok.io'
}else{
    callbackUrl = 'http://3.83.128.129/'
}

//6478737402

cron.schedule("0 8 * * 5-6", () => {
    console.log("---------------------");
    console.log("Running Cron Job");

    const readStream = feed.createReadStream()
        
    readStream.on('data', (val) => {
        console.log(val)

        client.calls
        .create({
            url: callbackUrl,
            // url: 'http://3368a56a.ngrok.io',
            // url: 'http://placeandsound.best/',
            to: `+${val}`,
            from: '+16475565651'
        })
        .then(call => console.log(call.sid))
        .catch((e) => {
            console.log(e)
        })
    })
    .on('end', () => {
        console.log('finished')
    })

});

app.post('/join', function (req, res) {
    const number = req.body.phoneNumber;
    console.log(`New Joiner ${number}`)
    console.log(`Using: ${callbackUrl}`)
    //Call
    client.calls
        .create({
            // url: 'http://placeandsound.best/',
            // url: 'http://3.83.128.129/',
            url: `${callbackUrl}/welcome`,
            to: `+${number}`,
            from: '+16475565651'
        })
        .then(call => console.log(call.sid))
        .catch((e) => {
            console.log(e)
        })

    //add to list
    feed.append(number, (e, val) => {
        if(e) res.sendStatus(500)
        else res.send({number: number})
    });
});
    
app.post('/list', function(req, res){
    if(req.body.secret == 'howdie'){
        feed.audit((e, val) => {
            if(e) res.sendStatus(500)
            else res.send(val)
        })
    }else {
        res.send(401)
    }
})

app.post('/welcome', function(req, res){
     console.log('called in welcome')
    scrape().then((listing) => {
        console.log(req)
        const twiml = new VoiceResponse();

        twiml.say({
            voice: 'woman',
            language: 'en',
          }, `Welcome to the Place & Sound bot service. The top place is ${listing.place}. The sound is ${listing.sound}. Enjoy the dancing.`);

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());

    }).catch((e) => {
        const twiml = new VoiceResponse();

        twiml.say({
            voice: 'alice',
            language: 'en',
          },`Welcome to the Place & Sound bot service. Sorry, there are no events on our radar. Smile and check back this weekend. Au revoir.`);

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    })
})

app.post('/', function(req, res){
    console.log('called')
	scrape().then((listing) => {
		console.log(req)
		const twiml = new VoiceResponse();

	    twiml.say({
		    voice: 'woman',
		    language: 'en',
		  }, `Hello from your pals at Place & Sound. The top place is ${listing.place}. The sound is ${listing.sound}. Enjoy the dancing.`);

	    res.writeHead(200, { 'Content-Type': 'text/xml' });
	    res.end(twiml.toString());

	}).catch((e) => {
        const twiml = new VoiceResponse();

        twiml.say({
            voice: 'alice',
            language: 'en',
          },`Hello from your pals at Place & Sound. Sorry, there are no events on our radar. Smile and check back this weekend.`);

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    })
})


function scrape() {
    return new Promise((resolve, reject) => {

        const url = `https://www.residentadvisor.net/events/ca/toronto/day/${moment().format('YYYY-MM-DD')}`;
        // const url = `https://www.residentadvisor.net/events/ca/toronto/day/${moment().subtract(1,'days').format('YYYY-MM-DD')}`;

        console.log(`Sending Request to: ${url}`)
        request(url, async (error, response, html) => {

            // First we'll check to make sure no errors occurred when making the request

            if(!error){
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

                var $ = cheerio.load(html);

                // var events

                $('.noEvents').filter(function(){
                	var data = $(this);
                    const noEvents = data.text();
                    console.log('noEvents')
                    console.log(noEvents)
                    if(noEvents.length > 1) {
                    	console.log('no events')
                    	reject({msg: "nothing posted"})
                    }
                })

                $('.event-title').filter(function(){
                    var data = $(this);
                    sound = data.children().first().text();
                    place = data.children().last().text();
                    console.log('------------')
                    console.log(sound)
                    console.log(place)
                    console.log('------------')
                    resolve({place: place, sound: sound })
                })

            }
        })
    })
}


app.listen(PORT)
console.log('Magic happens on port 8080');
