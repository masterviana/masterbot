var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    squareSize: 180,
    port: GLOBAL.service.configuration.port,
    prefix: GLOBAL.service.configuration.prefix,
    host   :GLOBAL.service.configuration.host
  });
});

router.get('/console', function(req, res, next) {
  res.render('console', {
    squareSize: 180,
    port: GLOBAL.service.configuration.port,
    prefix: GLOBAL.service.configuration.prefix,
    host   :GLOBAL.service.configuration.host
  });
});

module.exports = router;
