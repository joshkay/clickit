'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Post.associate = function(models) {
    // associations can be defined here

    Post.belongsTo(models.Topic, {
      foreignKey: 'topicId',
      onDelete: 'CASCADE'
    });

    Post.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    
    Post.belongsToMany(models.Flair, {
      foreignKey: 'postId',
      as: 'flairs',
      through: 'PostFlair'
    });

    Post.hasMany(models.Comment, {
      foreignKey: 'postId',
      as: 'comments'
    });

    Post.hasMany(models.Vote, {
      foreignKey: 'postId',
      as: 'votes'
    });

    Post.hasMany(models.Favorite, {
      foreignKey: 'postId',
      as: 'favorites'
    });

    Post.afterCreate((post, callback) =>
    {
      return models.Favorite.create({
        userId: post.userId,
        postId: post.id
      });
    });

    Post.afterCreate((post, callback) =>
    {
      return models.Vote.create({
        value: 1,
        userId: post.userId,
        postId: post.id
      });
    });
  };

  Post.prototype.getPoints = function()
  {
    if (this.votes.length === 0)
    {
      return 0;
    }

    return this.votes.reduce((prev, next) =>
    {
      return prev + next.value;
    }, 0);
  };

  Post.prototype.hasUpvoteFor = function(userId)
  {
    return this.votes.filter((vote) =>
    {
      return vote.userId === userId && vote.value === 1;
    }).length > 0;
  };

  Post.prototype.hasDownvoteFor = function(userId)
  {
    return this.votes.filter((vote) =>
    {
      return vote.userId === userId && vote.value === -1;
    }).length > 0;
  };

  Post.prototype.getFavoriteFor = function(userId)
  {
    return this.favorites.find((favorite) =>
    {
      return favorite.userId === userId;
    });
  }

  return Post;
};