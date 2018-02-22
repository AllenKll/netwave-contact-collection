const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.post('/syllabus', (req, res) => {
  if (body in req && req.body !== null)
  {
    res.end(JSON.stringify(req.body, null, 2));
  }
  else{
    res.status(400).end();
  }  
});

app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Example app listening on port ${ PORT }!`));