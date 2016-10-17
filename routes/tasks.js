var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'projects'
};

var pool = new pg.Pool(config);

router.get('/', function(req, res){

  pool.connect(function(err, client, done) {
      if (err) {
        console.log('Error connecting to the DB', err);
        res.sendStatus(500);
        done();
        return;
      }
      client.query('SELECT * FROM tasks;', function(err, result){
      done();
      if (err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        return;
      }

      console.log('Got rows from the DB:', result.rows);
      res.send(result.rows);
    });
  });
});

router.post('/', function(req, res){
  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting the DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    client.query('INSERT INTO tasks (task, status) VALUES ($1, $2) returning *;',
    [req.body.task, req.body.status],
    function(err, result){
      done();
      if (err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        return;
      }
      console.log('Got rows from the DB:', result.rows);
      res.send(result.rows);
    });
  });
});

router.put('/:id', function(req, res) {
  var id = req.params.id;
  var task = req.body.task;
  var status = req.body.status;

  pool.connect(function(err, client, done){
    try {
      if (err) {
        console.log('Error connecting the DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('UPDATE tasks SET task=$1, status=$2, WHERE id=$3 RETURNING *;',
      [task, status, id],
      function(err, result) {
        if (err) {
          console.log('Error querying database', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    } finally {
      done();
    }
  });
});

router.delete('/:id', function(req, res){
  var id = req.params.id;

  pool.connect(function(err, client, done){
    try {
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('DELETE FROM tasks WHERE id=$1;', [id], function(err){
        if (err) {
          console.log('Error querying the DB', err);
          res.sendStatus(500);
          return;
        }

        res.sendStatus(204);
      });
    } finally {
      done();
    }
  });
});


module.exports = router;
