const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const Database = require('./server/database.js').Database;
const DatabaseConfig = require('./server/databaseconfig.js').DatabaseConfig;

const app = express();
const server = require('http').createServer(app);
const database = new Database();

app
    .use(express.static(path.join(__dirname, 'client')))
    .use(bodyParser.json())
    .post(
        '/loadallcodes',
        (req, res) => {
          database.loadAllCodes()
              .then(allCodes => res.send(allCodes || {}))
              .catch(err => {
                console.error(err);
                res.send({})
              });
        })
    .post(
        '/saveallcodes',
        (req, res) => {
          if (!req.body) {
            res
                .status(400)
                .send("Expecting JSON object.");
            return;
          }
          database.saveAllCodes(req.body)
              .then(() => res.send({success: true}))
              .catch(err => {
                console.error(err);
                res.send({success: false});
              });
        });

server.listen(5000, () => {
  console.log('Listening on port 5000...');

  database.connect(DatabaseConfig.PATH);
});
