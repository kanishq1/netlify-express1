const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const { google } = require('googleapis');
const keys = require('../key.json');

app.use(express.static('./client/build'));
app.use(express.json());
app.use(cors());

var sheet = google.sheets('v4');

const port = process.env.PORT || 5003;

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

let id;
app.post('/register', (req, res) => {
  const { name, email, phone, class1, gender, subject } = req.body;

  //   const spreadsheet = {
  //     sheet1: {
  //       id: '1s9_umcUaSxCHzY_AfFz3LAV-DbFVpBouk4tNU8YxxR4',
  //     },
  //   };
  //   for (let sheets in spreadsheet) {
  //     value = spreadsheet[sheets];
  //     let eventarr = value.events;
  //     let b = eventarr.some((item) => events.includes(item));
  //     id = value.id;
  //     if (b == true) {
  //       console.log(id);
  //       authorize(add);
  //     }
  //   }
  authorize(add);

  async function add(authClient) {
    let cur_date = Date();
    var participant = {
      spreadsheetId: '1mszc_xSrj0G7193je-LhAjkNcO8JkJCNgPkYwee17fY',
      range: 'A1',
      auth: authClient,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[name, email, phone, class1, gender, cur_date, subject]],
      },
    };

    sheet.spreadsheets.values.append(participant, function (err, response) {
      if (err) {
        console.error(err);
        res.status(500).send();
      }
      res.status(200).send();
    });
  }
});

async function authorize(callback) {
  var authClient = new google.auth.JWT(keys.client_email, null, keys.private_key, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);
  if (authClient == null) {
    console.log('authentication failed');
    return;
  }
  callback(authClient);
}

app.listen(port, () => console.log(`listening on port ${port}`));
