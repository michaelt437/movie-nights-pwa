require("dotenv").config();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();
const msg = JSON.stringify({
  text: ":niccage: Update released!\n>1. movienights.netlify.app\n>2. Visit on your phone and add the app to home page"
});

xhr.open("POST", process.env.DEPLOY_HOOK);
xhr.send(msg);
console.log("hooked!");
