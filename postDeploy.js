require("dotenv").config();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();
const msg = JSON.stringify({
  text: ":niccage: Update released!\n>1. roll confirm should post to slack"
});

xhr.open("POST", process.env.DEPLOY_HOOK);
xhr.send(msg);
console.log("hooked!");
