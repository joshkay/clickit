const bcrypt = require('bcryptjs');

const User = require('./models').User;

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
  }
};