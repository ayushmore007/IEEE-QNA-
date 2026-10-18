const express = require('express');
const router = express.Router();
const { getStatus, setStatus } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/status', getStatus);
router.post('/submissions', protect, setStatus);

module.exports = router;
