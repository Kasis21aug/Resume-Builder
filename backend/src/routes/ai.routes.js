const router  = require('express').Router();
const protect = require('../middleware/auth.middleware');
const { generate } = require('../controllers/ai.controller');

router.post('/generate', protect, generate);

module.exports = router;
