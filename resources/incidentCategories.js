const Router = require('express').Router
const v4 = require('node-uuid').v4;
const utils =  require('../utilities');
const IncidentCategory = require('../models/incidentCategory');
const assign = require('object-assign');

const router = Router();

/**
 * GET-requests
 **/

router
  .route('/')
  .get((req, res) => {
    IncidentCategory.find().skip(req.query.skip || 0).limit(req.query.limit || 0).populate('cleaner').lean().exec((err, data) => {
      if (err) {
        console.log("error 1");
        res.send(400).send(err).end();
      }
      else {
        const configuredCollection = utils.configureCollection(data, req, IncidentCategory);

        res.status(200).type('json').json(configuredCollection).end();
      }
    });
  })
  .post((req, res) => {
    console.log("hello");
    if (req.get('Content-Type') == 'application/json'
    || req.get('Content-Type') == 'application/x-www-form-urlencoded') {
        const _id = v4();
        const newIncidentCategory = new IncidentCategory(assign(
          {},
          req.body,
          {
            _id
          }
        ));

        newIncidentCategory.save((err) => {
            if (err) {
              res.status(400).send(err).end();
            }
            else {
              IncidentCategory.findById(_id, (err, data) => {
                if (err) {
                  res.send(400).send(err).end();
                }
                else {
                  res.status(201).type('json').json(data).end();
                }
              });
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

    IncidentCategory.findById(req.params.id, (err, data) => {
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
