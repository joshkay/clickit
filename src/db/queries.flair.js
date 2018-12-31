const Topic = require('./models').Topic;
const Post = require('./models').Post;
const Flair = require('./models').Flair;

module.exports =
{
  addTopicFlair(newFlair, topicId, callback)
  {
    return Topic.findByPk(topicId)
    .then((topic) =>
    {
      Flair.create(newFlair)
      .then((flair) =>
      {
        flair.addTopic(topic)
        .then((topicFlair) =>
        {
          callback(null, topic);
        });
      });
    })
    .catch((err) =>
    {
      callback(err);
    });
  },
  addPostFlair(newFlair, postId, callback)
  {
    return Post.findByPk(postId)
    .then((post) =>
    {
      Flair.create(newFlair)
      .then((flair) =>
      {
        flair.addPost(post)
        .then((postFlair) =>
        {
          callback(null, post);
        });
      });
    })
    .catch((err) =>
    {
      callback(err);
    });
  },
  getFlair(id, callback)
  {
    return Flair.findByPk(id)
    .then((flair) =>
    {
      callback(null, flair)
    })
    .catch((err) =>
    {
      console.log(err);
      callback(err);
    });
  },
  deleteFlair(id, callback)
  {
    return Flair.destroy({
      where: {id}
    })
    .then((flair) =>
    {
      callback(null, flair);
    })
    .catch((err) =>
    {
      console.log(err);
      callback(err);
    });
  },
  updateFlair(id, updatedFlair, callback)
  {
    return Flair.findByPk(id)
    .then((flair) =>
    {
      if (!flair)
      {
        return callback('Flair not found');
      }

      flair.update(
        updatedFlair,
        {fields: Object.keys(updatedFlair)}
      )
      .then(() =>
      {
        callback(null, flair)
      })
      .catch((err) =>
      {
        console.log(err);
        callback(err);
      });
    });
  }
};