const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.post('/syllabus', (req, res) => {
  var buffer = "1\r\n";
  
  if ('body' in req && req.body !== null)
  {
    buffer += "2\r\n";
    buffer += JSON.stringify(req.body, null, 2);
    //res.end(JSON.stringify(req.body, null, 2));
  }
  else{
    buffer += "3\r\n";
    if ('body' in req){
      buffer += "4\r\n";
      buffer += "body in request\r\n";
      buffer += req.body;
      buffer += "\r\n";
    }
    buffer += "5\r\n";
  }  
  
  res.send(buffer);
});

app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Example app listening on port ${ PORT }!`));