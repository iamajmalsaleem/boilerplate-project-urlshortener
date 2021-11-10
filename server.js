require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var mongoose = require("mongoose");
let bodyParser = require('body-parser')

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

let urlObj = {}

app.post('/api/shorturl', bodyParser.urlencoded({ extended: false }), (req, response) => {
  let input = req.body.url
  urlObj['original_url'] = input

let shortUrl = 1

urlModel.findOne({})
.sort({short:"desc"})
.exec((err,res)=>{
  if(!err && res!=undefined){
     shortUrl=res.short+1
  }
  if(!err){
   urlModel.create({ original: input,short:shortUrl }, (err, res)=>{
  if (!err) {
    urlObj['short_url'] = res.short;
    response.json(urlObj)
  }
  
});
  }
})

})
 
