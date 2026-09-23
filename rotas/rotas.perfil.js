const { Router } = require('express');

const profileService = require('../services/service.profile');
const router = Router();

router.post('/profiles', profileService.store);
router.get('/profiles/:id', profileService.show);
module.exports = router;
