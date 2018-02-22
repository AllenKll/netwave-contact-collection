const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.post('/syllabus', (req, res) => {
  res.send("1\r\n");
  if ('body' in req && req.body !== null)
  {
    res.send("2\r\n");
    res.end(JSON.stringify(req.body, null, 2));
  }
  else{
    res.send("3\r\n");
    if ('body' in req){
      res.send("4\r\n");
      res.send("body in request\r\n");
      res.send(req.body);
      res.send("\r\n");
    }
    res.send("5\r\n");
    res.status(201).end();
  }  
});

app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Example app listening on port ${ PORT }!`));