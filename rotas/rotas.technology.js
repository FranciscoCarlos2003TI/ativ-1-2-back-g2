const { Router } = require('express');
const technologyService = require('../services/service.technology');
const router = Router();
router.post('/tech', technologyService.store);
router.get('/tech', technologyService.index);
module.exports = router;
