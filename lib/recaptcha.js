"use strict";

var https = require("https");
var querystring = require("querystring");

function Recaptcha(options) {
    this.secret = options.secret;
    this.response = options.response;
    this.remoteip = options.remoteip;
};

Recaptcha.prototype.verify = function (cb) {
    var self = this;

    var captchaBody = {};

    if (self.remoteip) captchaBody.remoteip = self.remoteip;

    if (self.secret && self.response) {
        captchaBody.secret = self.secret;
        captchaBody.response = self.response;
        var capQuery = querystring.stringify(captchaBody);

        var options = {
            host: "www.google.com",
            path: "/recaptcha/api/siteverify",
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': capQuery.length
            }
        };


        var request = https.request(options, function (response) {
            var body = '';
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                body += chunk;
            });
            response.on('end', function () {
                var responseData;
                try {
                    responseData = JSON.parse(body);
                } catch (err) {
                     return cb(err)
                }
                var status = responseData.success;
                var errorCode = responseData["error-codes"];

                if (!status) {
                    var error = {};
                    error.name = errorCode;
                    switch (errorCode) {
                        case "missing-input-secret":
                            error.message = "The secret parameter is missing.";
                            break;
                        case "invalid-input-secret":
                            error.message = "The secret parameter is invalid or malformed.";
                            break;
                        case "missing-input-response":
                            error.message = "The response parameter is missing.";
                            break;
                        case "invalid-input-response":
                            error.message = "The response parameter is invalid or malformed.";
                            break;
                        default :
                            error.message = "Unknown error"
                    }
                    cb(error);
                } else {
                    cb(null, true)
                }
            })
        });
        request.on('error', function (err) {
            cb(err)
        });
        request.write(capQuery, 'utf8');
        request.end();

    } else {
        cb({
            name : "Invalid input",
            message : "your 'secret' or 'response' is not null"
        });
    }
};

module.exports = Recaptcha;
