const http = require('http');
const port = process.env.PORT || 8080;
const file = require('fs').readFileSync('./picture.scr');

let last = 0;

http
  .createServer((req, res) => {
    console.log(
      new Date().toJSON() + ' - request: ' + req.method + ' ' + req.url
    );
    if (req.method === 'POST') {
      const data = [];
      req.on('data', (chunks) => {
        data.push(...chunks);
      });
      req.on('end', () => {
        last = data.length;
        console.log('closed @ ' + data.length + ' bytes');
        console.log(
          Array.from(data)
            .map((_) => _.toString(16).padStart(2, '0'))
            .join(' ')
        );
        console.log(data.map((_) => String.fromCharCode(_)).join(''));
      });

      return res.end('OK');
    }

    // this is a GET - TODO send the high scores file.
    res.end(
      // `This was sent from my server\r\rPretty chuffed!\r\rI also received ${last} bytes in the post`
      file
    );
    console.log('sent');
  })
  .listen(port);
