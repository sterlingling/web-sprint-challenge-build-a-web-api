const express = require('express');
const Project = require('./projects-model');
const { validateUserId } = require('./projects-middleware')

const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => {
    Project.get().then(projects => {
        if (projects) {
            res.status(200).json(projects)
        } else {
            res.json([]);
        }
    })
        .catch(() => {
            res.status(400).json({ message: 'no projects' })
        })
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Project.get(id);
        if (result === null) {
            res.status(404).json({ message: 'Project not found' });
        } else {
            res.status(200).json(result);
        }
    } catch {
        res.status(500)
    }
})

router.post('/', (req, res) => {
    const { name, description, completed } = req.body;

    if (!name || !name.trim() || !description || !description.trim() || completed === undefined) {
        return res.status(400).json({ message: 'Name, description, and completed are required fields' });
    } else {
        Project.insert({ name, description, completed })
            .then((newProject) => {
                res.status(201).json(newProject);
            })
            .catch(() => {
                res.status(500).json({ message: 'Internal server error' });
            });
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, completed } = req.body;

    try {
        const result = await Project.get(id);
        if (result === null) {
            res.status(404).json({ message: 'Project not found' });
        } if (!name || !name.trim() || !description || !description.trim() || completed === undefined) {
            return res.status(400).json({ message: 'Name, description, and completed are required fields' });
        } else {
            Project.update(id, { name: name, description: description, completed: completed }).then((newProject) => {
                res.status(201).json(newProject);
            }).catch(() => {
                res.status(500)
            })
        }
    } catch {
        res.status(500)
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Project.get(id);
        if (result === null) {
            res.status(404).json({ message: 'Project not found' });
        } else {
            await Project.remove(id)
            res.status(200).json(result);
        }
    } catch {
        res.status(500)
    }
})

router.get('/:id/actions', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Project.get(id);
        if (result === null) {
            res.status(404).json({ message: 'Project not found' });
        } else {
            Project.getProjectActions(id).then(projects => {
                if (projects) {
                    res.status(200).json(projects)
                } else {
                    res.json([]);
                }
            }).catch(() => {
                res.status(500)
            })
        }
    } catch {
        res.status(500)
    }
})





module.exports = router;