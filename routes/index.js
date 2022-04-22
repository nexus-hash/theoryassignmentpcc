var express = require("express");
var router = express.Router();
const { google } = require("googleapis");

const CLIENT_ID = "add your client id here";
const CLIENT_SECRET =  "add your client secret here";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://localhost:3000/oauth2callback"
);

/* GET home page. */
router.get("/", function (req, res, next) {
  

  // generate a url that asks permissions for Blogger and Google Calendar scopes
  const scopes = "profile email";

  const url = oauth2Client.generateAuthUrl({
    
    // If you only need one scope you can pass it as a string
    scope: scopes,
  });
  res.render("index", { url: url });
});

router.get('/oauth2callback', function (req, res, next) {
  const code = req.query.code;
  var oauth2 = google.oauth2({
    version: "v2",
    auth: oauth2Client,
  });
  oauth2Client.getToken(code, function (err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (!err) {
      oauth2Client.setCredentials(tokens);

      oauth2.userinfo.get(function (err, userinfo) {
        if (err) {
          console.log("The API returned an error: " + err);
          return;
        }
        console.log("userinfo: ", userinfo);
        res.render("userdetails", {
          email: userinfo.data.email,
          name: userinfo.data.name,
        });
      });
    }
  });
})

module.exports = router;
