const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var requiredFields = [
		"name",
		"phone",
		"interest"
];

app.use(bodyParser.json());

app.post('/syllabus', (req, res) => {
  var buffer = "";
  if ('body' in req && req.body !== null) {
    // check for required fields
	for (var i=0; i<requiredFields.length; ++i ){
		if (!(requiredFields[i] in req.body)) {
			res.status(400);
			res.send("Missing required parameters");
			return;
		}
	}
    //buffer += JSON.stringify(req.body, null, 2);
  } else {
    if ('body' in req){
      buffer += "null body\r\n";
    } else {
      buffer += "no body in request\r\n";
    }
    res.status(400);
  }  
  
  res.send(buffer);
})

app.get('*', (req, res) => {
	res.status(404).end();
});

app.listen(PORT, () => console.log(`Listening on port ${ PORT }!`));
