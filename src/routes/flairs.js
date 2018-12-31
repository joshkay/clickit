const express = require('express');
const router = express.Router();

const flairController = require('../controllers/flairController');

router.get('/topics/:topicId/flairs/new', flairController.newTopic);
router.get('/topics/:topicId/posts/:postId/flairs/new', flairController.newPost);
router.post('/topics/:topicId/flairs/create', flairController.createTopic);
router.post('/topics/:topicId/posts/:postId/flairs/create', flairController.createPost);
router.get('/flairs/:id', flairController.show);
router.post('/flairs/:id/destroy', flairController.destroy);
router.get('/flairs/:id/edit', flairController.edit);
router.post('/flairs/:id/update', flairController.update);

module.exports = router;