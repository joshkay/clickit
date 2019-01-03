const request = require('request');
const server = require('../../src/server');

const base = 'http://localhost:3000/topics';

const sequelize = require('../../src/db/models/index').sequelize;

const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const User = require('../../src/db/models').User;
const Favorite = require('../../src/db/models').Favorite;

describe('routes: favorites', () =>
{
  beforeEach((done) =>
  {
    this.user;
    this.topic;
    this.post;

    sequelize.sync({force: true}).then((res) =>
    {
      User.create({
        email: 'starman@tesla.com',
        password: 'Trekkie4lyfe'
      })
      .then((user) =>
      {
        this.user = user;

        Topic.create({
          title: 'Expeditions to Alpha Centauri',
          description: 'A compilation of reports from recent visits to the star system.',
          posts: 
          [{
            title: 'My first visit to Proxima Centauri b',
            body: 'I saw some rocks.',
            userId: this.user.id
          }]
        }, 
        {
          include: 
          {
            model: Post,
            as: 'posts'
          }
        })
        .then((topic) =>
        {
          this.topic = topic;
          this.post = topic.posts[0];

          done();
        });
      })
      .catch((err) =>
      {
        console.log(err);
        done();
      });
    });
  });

  describe('guest attempting to favorite a post', () =>
  {
    beforeEach((done) =>
    {
      request.get({
        url: 'http://localhost:3000/auth/fake',
        form:
        {
          userId: 0
        }
      }, (err, res, body) =>
      {
        done();
      });
    });

    describe('POST /topics/:topicId/posts/:postId/favorites/create', () =>
    {
      it('should not create a new favorite', (done) =>
      {
        const options =
        {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/favorites/create`
        };

        this.post.getFavorites()
        .then((favorites) =>
        {
          const favCountBeforeCreate = favorites.length;

          request.post(options, (err, res, body) =>
          {
            Favorite.findAll()
            .then((favorites) =>
            {
              expect(favCountBeforeCreate).toBe(favorites.length);
              done();
            })
            .catch((err) =>
            {
              console.log(err);
              done();
            });
          });
        });
      });
    });
  });

  describe('signed in user favoriting a post', () =>
  {
    beforeEach((done) =>
    {
      User.create({
        email: 'favorite@test.com',
        password: 'password'
      })
      .then((user) =>
      {
        this.user = user;

        request.get({
          url: 'http://localhost:3000/auth/fake',
          form:
          {
            role: this.user.role,
            userId: this.user.id
          }
        }, (err, res, body) =>
        {
          done();
        });
      });
    });

    describe('POST /topics/:topicId/posts/:postId/favorites/create', () =>
    {
      it('should create a new favorite', (done) =>
      {
        Favorite.findOne({
          where: {
            userId: this.user.id,
            postId: this.post.id
          }
        })
        .then((favorite) =>
        {
          expect(favorite).toBeNull();

          const options =
          {
            url: `${base}/${this.topic.id}/posts/${this.post.id}/favorites/create`
          };
  
          request.post(options, (err, res, body) =>
          {
            Favorite.findOne({
              where: {
                userId: this.user.id,
                postId: this.post.id
              }
            })
            .then((favorite) =>
            {
              expect(favorite).not.toBeNull();
              expect(favorite.userId).toBe(this.user.id);
              expect(favorite.postId).toBe(this.post.id);
              done();
            })
            .catch((err) =>
            {
              expect(err).toBeNull();
              done();
            });
          });
        })
        .catch((err) =>
        {
          expect(err).toBeNull();
          done();
        });
      });
    });

    describe('POST /topics/:topicId/posts/:postId/favorites/:id/destroy', () =>
    {
      it('should destroy a favorite', (done) =>
      {
        Favorite.findOne({
          where: {
            userId: this.user.id,
            postId: this.post.id
          }
        })
        .then((favorite) =>
        {
          expect(favorite).toBeNull();

          const options =
          {
            url: `${base}/${this.topic.id}/posts/${this.post.id}/favorites/create`
          };

          request.post(options, (err, res, body) =>
          {
            Favorite.findOne({
              where: {
                userId: this.user.id,
                postId: this.post.id
              }
            })
            .then((favorite) =>
            {
              expect(favorite).not.toBeNull();
              
              request.post(
                `${base}/${this.topic.id}/posts/${this.post.id}/favorites/${favorite.id}/destroy`,
                (err, res, body) =>
                {
                  Favorite.findOne({
                    where: {
                      userId: this.user.id,
                      postId: this.post.id
                    }
                  })
                  .then((favorite) =>
                  {
                    expect(favorite).toBeNull();
                    done();
                  });
                }
              );
            })
            .catch((err) =>
            {
              console.log(err);
              done();
            });
          });
        })
        .catch((err) =>
        {
          expect(err).toBeNull();
          done();
        });
      });
    });
  });
});