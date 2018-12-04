const express = require('express');

const topicController = require('../controllers/topicController');

const router = express.Router();

router.get('/topics', topicController.index);

module.exports = router;