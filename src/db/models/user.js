'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: 'must be a valid email' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'member'
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Post, {
      foreignKey: 'userId',
      as: 'posts'
    });
  };

  User.prototype.isAdmin = function() {
    return this.role === 'admin';
  };

  User.prototype.isMember = function() {
    return this.role === 'member';
  };

  User.prototype.isOwner = function(record) {
    if (record && record.userId)
    {
      return this.id === record.userId;
    }
    return false;
  };

  return User;
};