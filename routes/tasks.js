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

    client.query('INSERT INTO tasks (task) VALUES ($1) returning *;',
    [req.body.task],
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


router.put('/:id', function(req, res){
  console.log('Completing a task');
  var id = req.params.id;

  pool.connect (function(err, client, done){
    try {
    if(err){
      console.log('Error connecting to the database');
      res.sendStatus(500);
      return;
    }

      client.query('UPDATE tasks SET is_complete=$2 WHERE id=$1 RETURNING *;',
       [id, true], function(err, results){
        done();
        if(err){
          console.log('Error Completing completeTask: ', err);
          res.sendStatus(500);
        } else {
          console.log(results.rows);
          res.send(results.rows);
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
