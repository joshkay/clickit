const bcrypt = require('bcryptjs');

const User = require('./models').User;
const Post = require('./models').Post;
const Comment = require('./models').Comment;

module.exports =
{
  createUser(newUser, callback)
  {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    // if this is the first ever user make them an admin
    return User.findAll()
    .then((users) =>
    {
      const role = users.length === 0 ? 'admin' : 'member';

      User.create({
        email: newUser.email,
        password: hashedPassword,
        role: role
      })
      .then((user) =>
      {
        callback(null, user);
      })
      .catch((err) =>
      {
        callback(err);
      });
    })
    .catch((err) =>
    {
      callback(err);
    });
  },
  getUser(id, callback)
  {
    let result = {};

    User.scope({method: ['favoritedPosts', id]}).findOne()
    .then((user) =>
    {
      if (!user) 
      {
        callback(404);
      }
      else
      {
        const favoritedPosts = user.favorites.map((favorite) =>
        {
          return favorite.Post;
        });
        user.favorites = null;

        result['user'] = user;
        result['favoritedPosts'] = favoritedPosts;

        Post.scope({method: ['lastFiveFor', id]}).findAll()
        .then((posts) =>
        {
          result['posts'] = posts;

          Comment.scope({method: ['lastFiveFor', id]}).findAll()
          .then((comments) =>
          {
            result['comments'] = comments;

            callback(null, result);
          });
        })
        .catch((err) =>
        {
          callback(err);
        });
      }
    });
  }
};