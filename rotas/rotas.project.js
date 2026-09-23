const { Router } = require('express');
const projectService = require('../services/service.project');
const router = Router();

router.get('/projects', projectService.index);
router.post('/projects', projectService.store);

router.get('/projects/:id', projectService.show);
router.post('/projects/:id/feedbacks', projectService.storeFeedback);
router.put('/projects/:id/upvote', projectService.upvote);

module.exports = router;
