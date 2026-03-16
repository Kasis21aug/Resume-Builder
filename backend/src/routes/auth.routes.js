const router  = require('express').Router();
const protect = require('../middleware/auth.middleware');
const { register, login, upgrade } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login',    login);
router.put('/upgrade', protect, upgrade);

module.exports = router;
