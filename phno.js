const express = require('express');
const app = express();
const port = 3000;


const accountSid = 'ACf5cc137857654a7e9148d95b3f689dbd';
const authToken = 'a07ccdbb0c73b81cad1600f4efb79c72';
const twilioNumber = '+13105792877';
const client = require('twilio')(accountSid, authToken);





require('dotenv').config();

app.set('view engine','ejs');

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req,res) => {
    res.render("phone");
})

app.post("/send",async (req,res) => {
    console.log(req.body);
    client.messages
    .create({
       body: 'Hello' + req.body.username,
       from: twilioNumber,
       to: '+91' + req.body.phonenumber
     })
    .then(message => console.log(message.sid));
    res.redirect("/send");
    
})

app.listen(port , ()=>{
    console.log("Started at port " + port);
})