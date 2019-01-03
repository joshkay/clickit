'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'favorites_post_user'
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'favorites_post_user'
    }
  }, {});
  Favorite.associate = function(models) {
    // associations can be defined here
    Favorite.belongsTo(models.Post, {
      foreignKey: 'postId',
      onDelete: 'CASCADE'
    });

    Favorite.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Favorite;
};