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

    User.findByPk(id)
    .then((user) =>
    {
      if (!user) 
      {
        callback(404);
      }
      else
      {
        result['user'] = user;

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