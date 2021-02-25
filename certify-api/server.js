const express = require('express');
const bodyParser = require('body-parser');

const Routes = require('./src/routes/certify.routes')


const app = express()
const port = 3001;

let server = app.listen(port);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else if( req.method === 'POST') {
        const contentType = req.headers['content-type'];
        if( !contentType.match(/application\/json/)){
            return res.sendStatus(406);
        }
        return next();
    }else {
        return next();
    }
});

app.use(bodyParser.json());

Routes.routes(app);

console.log('Server started on: ' + port);

module.exports = server