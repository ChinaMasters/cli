const path = require('path')
const fs = require('fs')
fs.appendFileSync(path.resolve(__dirname, 'handle.js'), "var dom = documnentGetElementById('app');\ndom.style.color = 'orange';");