const express = require('express');

const Action = require('./actions-model');
const Project = require('../projects/projects-model')

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    Action.get().then((actions) => {
        if (actions) {
            res.status(200).json(actions);
        } else {
            res.json([])
        }
    }).catch(() => {
        res.status(500)
    })
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const possibleAction = await Action.get(id);
        if (possibleAction === null) {
            res.status(404).json({
                message: "action not found"
            })
        } else {
            res.json(possibleAction)
        }
    } catch {
        res.status(500)
    }
})

router.post('/', (req, res) => {
    const action = req.body
    console.log(action)
    // Project.get

    if (!action.project_id || !action.description || !action.notes) {
        res.status(400).json({ message: "missing required fields" });
    } else {
        Action.insert(action).then((newAction) => {
            res.status(201).json(newAction);
        }).catch(() => {
            res.status(500);
        })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const action = req.body;
    try {
        const possibleAction = await Action.get(id);
        if (possibleAction === null) {
            res.status(404).json({ message: 'Action not found' });
        } if (!action.project_id || !action.description || !action.notes) {
            return res.status(400).json({ message: "missing required fields" });
        } else {
            Action.update(id, action).then((action) => {
                res.status(201).json(action)
            }).catch(() => {
                res.status(500)
            })
        }
    } catch {
        res.status(500).json({ message: "error" })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const possibleAction = await Action.get(id);
        if (possibleAction === null) {
            res.status(404).json({ message: 'Action not found' });
        } else {
            Action.remove(id).then((action) => {
                res.status(200).json(action);
            }).catch(() => {
                res.status(400)
            })
        }
    } catch {
        res.status(500)
    }
})

module.exports = router;