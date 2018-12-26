const flairQueries = require('../db/queries.flair');

module.exports =
{
  newTopic(req, res, next)
  {
    res.render('flairs/topic/new', {topicId: req.params.topicId});
  },
  newPost(req, res, next)
  {
    res.render('flairs/post/new', {
      topicId: req.params.topicId,
      postId: req.params.postId
    });
  },
  createTopic(req, res, next)
  {
    let newFlair =
    {
      name: req.body.name,
      color: req.body.color
    };

    flairQueries.addTopicFlair(newFlair, req.params.topicId, (err, topic) =>
    {
      if (err)
      {
        res.redirect(500, `/topics/${topic.id}/flairs/new`);
      }
      else
      {
        res.redirect(303, `/topics/${topic.id}`);
      }
    });
  },
  createPost(req, res, next)
  {
    let newFlair =
    {
      name: req.body.name,
      color: req.body.color
    };

    flairQueries.addPostFlair(newFlair, req.params.postId, (err, post) =>
    {
      if (err)
      {
        res.redirect(500, `/topics/${post.topicId}/posts/${post.id}/flairs/new`);
      }
      else
      {
        res.redirect(303, `/topics/${post.topicId}/posts/${post.id}`);
      }
    });
  },
  show(req, res, next)
  {
    flairQueries.getFlair(req.params.id, (err, flair) =>
    {
      if (err || flair == null)
      {
        res.redirect(404, '/');
      }
      else
      {
        res.render('flairs/show', {flair});
      }
    });
  },
  destroy(req, res, next)
  {
    flairQueries.deleteFlair(req.params.id, (err, flair) =>
    {
      if (err)
      {
        res.redirect(500, `/flairs/${flair.id}`);
      }
      else
      {
        res.redirect(303, '/topics');
      }
    });
  },
  edit(req, res, next)
  {
    flairQueries.getFlair(req.params.id, (err, flair) =>
    {
      if (err || flair == null)
      {
        res.redirect(404, '/');
      }
      else
      {
        res.render('flairs/edit', {flair});
      }
    });
  },
  update(req, res, next)
  {
    flairQueries.updateFlair(req.params.id, req.body, (err, flair) =>
    {
      if (err || flair == null)
      {
        res.redirect(404, `/flairs/${req.params.id}/edit`);
      }
      else
      {
        res.redirect(`/flairs/${flair.id}`);
      }
    });
  }
};