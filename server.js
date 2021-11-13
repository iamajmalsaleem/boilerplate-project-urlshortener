require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var mongoose = require("mongoose");
let bodyParser = require('body-parser')
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const mySecret = process.env['url-URI']
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

let { Schema } = mongoose
let urlSchema = new Schema({
  original: { type: String, required: true },
  short: Number
})

let urlModel = mongoose.model('URL', urlSchema)

let urlObj = {};


app.post('/api/shorturl', bodyParser.urlencoded({ extended: false }), (req, response) => {
  let input = req.body.url

  let urlStr = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/gi);

  if (!input.match(urlStr)) {
    response.json({ error: 'Invalid URL' })
    return
  }



  urlObj['original_url'] = input

  let shortUrl = 1

  /*
  let count = 1;
   urlModel.findOne({ original: input })
     .select("original")
     .select("short")
     .select("-_id")
     .exec((err, res) => {
       if (!err && res != undefined) {
 
         return (response.json({ original_url: res.original, short_url: res.short }))
 
        // count = 2;
        // console.log("1st" + count)
       }
     })
 
   //console.log("2nd" + count)
   //if (count == 2) { return }
  // else {
 */

  urlModel.findOne({})
    .sort({ short: "desc" })
    .exec((err, res) => {
      if (!err && res != undefined) {
        shortUrl = res.short + 1
      }
      if (!err) {
        urlModel.create({ original: input, short: shortUrl }, (err, res) => {
          if (!err) {
            urlObj['short_url'] = res.short;
            response.json(urlObj)
          }

        });
      }
    })
  // }

})

app.get("/api/shorturl/:short", (req, resp) => {
  shortUrl = req.params.short
  urlModel.findOne({ short: shortUrl }, (err, res) => {
    if (!err && res != undefined) {
      resp.redirect(res.original)
    } else {
      resp.json({ error: 'URL Does Not Exist' })
    }
  })
})