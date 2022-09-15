// Write your "actions" router here!
const express = require('express');

const router = express.Router();

const Action = require('./actions-model');

router.get('/', (req, res) => {
  Action.get()
    .then((actions) => {
      res.json(actions);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'The actions could not be retrieved',
        err: err.message,
      });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  Action.get(id)
    .then((action) => {
      if (action) {
        res.json(action);
      } else {
        res.status(404).send('no action found');
      }
    })

    .catch((err) => {
      res.status(500).json({
        message: 'The action could not be retrieved',
        err: err.message,
      });
    });
});
router.post('/', (req, res) => {
  if (!req.body.project_id || !req.body.description || !req.body.notes) {
    res.status(400).send('project_id, description and notes are required');
  } else {
    Action.insert(req.body)

      .then((action) => {
        res.status(201).json(action);
      })
      .catch((err) => {
        res.status(500).json({
          message: 'action could not be added',
          err: err.message,
        });
      });
  }
});
router.put('/:id', (req, res) => {
  const { id } = req.params;
  if (
    !req.body.project_id ||
    !req.body.description ||
    !req.body.notes ||
    req.body.completed === undefined
  ) {
    res
      .status(400)
      .send('project_id, description, completed  and notes are required');
  } else {
    Action.update(id, req.body)
      .then((action) => {
        if (!action) {
          res.status(404).send('action not found');
        } else {
          res.status(200).json(action);
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: 'The action could not be updated',
          err: err.message,
        });
      });
  }
});
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Action.get(id).then((action) => {
    if (!action) {
      res.status(404).send('action not found');
    } else {
      Action.remove(id)
        .then(() => res.sendStatus(204))
        .catch((err) => {
          res.status(500).json({
            message: 'The action could not be updated',
            err: err.message,
          });
        });
    }
  });
});

module.exports = router;
