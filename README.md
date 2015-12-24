Node-Recaptcha

>Node modules support Google ReCAPTCHA

How to use

On browser :

```

<script src='https://www.google.com/recaptcha/api.js'></script>
<div class="g-recaptcha" data-sitekey="6Ld7yBMTAAAAAPfy0UHf5bN_YA4PbNGFCH06Yg0z"></div>

```

Server logic with express

```
var recaptcha = require("recaptcha_v2");
app.use("/test",function(req,res){
    var captcha = new recaptcha({
        secret	: <your key>
        response : req.body['g-recaptcha-response']
        remoteip : <remote ip> //optional
    });
    
    captcha.verify(function(err,done){
        if(err) {
           return res.send(err)
        } 
        if(done) {
           // recaptcha verified
        }      
    });
})

```
