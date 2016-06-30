const Router = require('express').Router
const v4 = require('node-uuid').v4;
const utils =  require('../utilities');
const Cleaner = require('../models/cleaner');
const assign = require('object-assign');

const router = Router();

/**
 * GET-requests
 **/

router
  .route('/')
  .get((req, res) => {
    Cleaner.find().skip(req.query.skip || 0).limit(req.query.limit || 0).lean().exec((err, data) => {
      if (err) {
        res.send(400).send(err).end();
      }
      else {
        const configuredCollection = utils.configureCollection(data, req, Cleaner);

        res.status(200).type('json').json(configuredCollection).end();
      }
    });
  })
  .post((req, res) => {
    if (req.get('Content-Type') == 'application/json'
    || req.get('Content-Type') == 'application/x-www-form-urlencoded') {
        const newCleaner = new Cleaner(assign(
          {},
          req.body,
          {
            _id: v4()
          }
        ));

        newCleaner.save((err) => {
            if (err) {
              res.status(400).send(err).end();
            }
            else {
              res.status(201).end();
            }
        });
    }
    else {
      res.status(415).end();
    }
  })

router
  .route('/:id')
  .get((req, res) => {
    if (!req.params.id) {
      res.send(400).send('No id found.').end();
    }

    Cleaner.findById(req.params.id, (err, data) => {
      if (err) {
        res.send(400).send(err).end();
      }
      else {
        res.status(200).type('json').json(data).end();
      }
    }
  );
});

module.exports = router;
