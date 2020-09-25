require("dotenv").config();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();
const msg = JSON.stringify({
  text: ":niccage: Update released!\n>1. added genres to movies. able to filter list and pick pool by genre. \n>2. display number of movies on list page"
});

// xhr.open("POST", process.env.DEPLOY_HOOK);
// xhr.send(msg);
