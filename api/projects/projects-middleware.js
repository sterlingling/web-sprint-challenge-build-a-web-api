// add middlewares here related to projects
const Project = require('./projects-model');


async function validateUserId(req, res, next) {
    try {
        const project = await Project.get(req.params.id);
        if (!project) {
            res.status(404).json({ message: 'user not found' })
        } else {
            req.project = project
            next()
        }
    } catch {
        res.status(500).json({ message: 'error' })

    }
}

module.exports = {
    validateUserId
}