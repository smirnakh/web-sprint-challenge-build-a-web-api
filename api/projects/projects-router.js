// Write your "projects" router here!
const { request } = require('express');
const express = require('express');

const router = express.Router();

const Project = require('./projects-model');

router.get('/', (req, res) => {
  Project.get()
    .then((projects) => {
      res.json(projects);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'The posts information could not be retrieved',
        err: err.message,
      });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  Project.get(id)
    .then((project) => {
      if (project) {
        res.json(project);
      } else {
        res.status(404).send('no project found');
      }
    })

    .catch((err) => {
      res.status(500).json({
        message: 'The project could not be retrieved',
        err: err.message,
      });
    });
});

router.post('/', (req, res) => {
  if (!req.body.name || !req.body.description) {
    res.status(400).send('name and description is required');
  } else {
    Project.insert(req.body)

      .then((project) => {
        res.status(201).json(project);
      })
      .catch((err) => {
        res.status(500).json({
          message: 'The project could not be added',
          err: err.message,
        });
      });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  if (
    !req.body.name ||
    !req.body.description ||
    req.body.completed === undefined
  ) {
    res.status(400).send('name and description and completed are required');
  } else {
    Project.update(id, req.body)
      .then((project) => {
        if (!project) {
          res.status(404).send('project not found');
        } else {
          res.status(200).json(project);
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: 'The project could not be updated',
          err: err.message,
        });
      });
  }
});
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Project.get(id).then((project) => {
    if (!project) {
      res.status(404).send('project not found');
    } else {
      Project.remove(id)
        .then(() => res.sendStatus(204))
        .catch((err) => {
          res.status(500).json({
            message: 'The project could not be updated',
            err: err.message,
          });
        });
    }
  });
});

router.get('/:id/actions', (req, res) => {
  const { id } = req.params;
  Project.getProjectActions(id)
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'The project actions could not be found',
        err: err.message,
      });
    });
});

module.exports = router;
