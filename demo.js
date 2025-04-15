const sqlite3 = require('sqlite3').verbose();

async function executeQuery() {
  var db = new sqlite3.Database('restaurant.db');

  try {
    let sql = 'INSERT INTO appetizers (name, price) VALUES (?, ?)';
    let values = ['value1', 'value2'];

    let result = await new Promise((resolve, reject) => {
      db.run(sql, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    console.log('Query executed successfully');
  } catch (err) {
    console.error(err);
  } finally {
    db.close();
  }
}

executeQuery();
let sql = 'SELECT * FROM appetizers';
db.run(sql)
    .then((rows) => {
        console.log(rows);
    })
    .catch((err) => {
        console.error(err);
    });