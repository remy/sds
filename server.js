require('renvy'); // env values
const express = require('express');

const app = express();
app.disable('x-powered-by');
app.set('etag', false);
app.use(require('./routes/error'));
app.use('/', require('./routes')); // mount the router
app.use(require('./routes/error'));
app.use(express.static(__dirname + '/public/'));

app.listen(process.env.PORT);
