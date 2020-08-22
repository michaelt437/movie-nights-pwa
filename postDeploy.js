require("dotenv").config();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();
const msg = JSON.stringify({
  text: ":niccage: Update released!\n>1. fix width of cards on web\n2. turn off autocomplete in forms"
});

xhr.open("POST", process.env.DEPLOY_HOOK);
xhr.send(msg);
console.log("hooked!");
