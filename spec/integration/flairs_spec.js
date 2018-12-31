const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000';

const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const Flair = require('../../src/db/models').Flair;
const User = require('../../src/db/models').User;

describe('routes : flair', () =>
{
  this.topic;
  this.post;
  this.flair;
  this.user;

  beforeEach((done) =>
  {
    sequelize.sync({force: true}).then((rest) =>
    {
      User.create({
        email: 'frosty@snowman.com',
        password: 'snowba11',
        role: 'member'
      })
      .then((user) =>
      {
        this.user = user;

        Topic.create({
          title: 'Winter Games',
          description: 'Post your Winter Games stories.',
          posts: [{
            title: 'Snowball Fighting',
            body: 'So much snow!',
            userId: this.user.id
          }]
        },
        {
          include: {
            model: Post,
            as: 'posts'
          }
        })
        .then((topic) =>
        {
          this.topic = topic;
          this.post = topic.posts[0];
  
          Flair.create({
            name: 'Skiing',
            color: 'Green'
          })
          .then((flair) =>
          {
            this.flair = flair;
            done();
          });
        });
      })
      .catch((err) =>
      {
        console.log(err);
        done();
      });
    });
  });

  describe('GET /topics/:topicId/flairs/new', () =>
  {
    it('should render a new post form', (done) =>
    {
      request.get(`${base}/topics/${this.topic.id}/flairs/new`, (err, res, body) =>
      {
        expect(err).toBeNull();
        expect(body).toContain('New Topic Flair');
        done();
      });
    });
  });

  describe('GET /topics/:topicId/posts/:postId/flairs/new', () =>
  {
    it('should render a new post form', (done) =>
    {
      request.get(`${base}/topics/${this.topic.id}/posts/${this.post.id}/flairs/new`, (err, res, body) =>
      {
        expect(err).toBeNull();
        expect(body).toContain('New Post Flair');
        done();
      });
    });
  });

  describe('POST /topics/:topicId/flairs/create', () =>
  {
    it('should create a new topic flair and redirect', (done) =>
    {
      const options =
      {
        url: `${base}/topics/${this.topic.id}/flairs/create`,
        form:
        {
          name: 'Controversial',
          color: 'Red'
        }
      };

      request.post(options, (err, res, body) =>
      {
        Flair.findOne({where: {name: 'Controversial'}})
        .then((flair) =>
        {
          this.topic.getFlairs()
          .then((flairs) =>
          {
            expect(err).toBeNull();
            expect(res.statusCode).toBe(303);
            
            expect(flair).not.toBeNull();
            expect(flair.name).toBe('Controversial');
            expect(flair.color).toBe('Red');

            expect(flairs.length).toBe(1);
            expect(flairs[0].id).toBe(flair.id);
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
  });

  describe('POST /topics/:topicId/posts/:postId/flairs/create', () =>
  {
    it('should create a new post flair and redirect', (done) =>
    {
      const options =
      {
        url: `${base}/topics/${this.topic.id}/posts/${this.post.id}/flairs/create`,
        form:
        {
          name: 'Boring',
          color: 'Blue'
        }
      };

      request.post(options, (err, res, body) =>
      {
        Flair.findOne({where: {name: 'Boring'}})
        .then((flair) =>
        {
          this.post.getFlairs()
          .then((flairs) =>
          {
            expect(err).toBeNull();
            expect(res.statusCode).toBe(303);

            expect(flair).not.toBeNull();
            expect(flair.name).toBe('Boring');
            expect(flair.color).toBe('Blue');

            expect(flairs.length).toBe(1);
            expect(flairs[0].id).toBe(flair.id);
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
  });

  describe('GET /flairs/:id', () =>
  {
    it('should render a view with the selected flair', (done) =>
    {
      request.get(`${base}/flairs/${this.flair.id}`, (err, res, body) =>
      {
        expect(err).toBeNull();
        expect(body).toContain('Skiing');
        expect(body).toContain('Green');
        done();
      });
    });
  });

  describe('POST /flairs/:id/destroy', () =>
  {
    it('should delete the flair with the associated ID', (done) =>
    {
      Flair.findAll()
      .then((flairs) =>
      {
        const flairCountBeforeDelete = flairs.length;
        expect(flairCountBeforeDelete).toBe(1);

        request.post(`${base}/flairs/${this.flair.id}/destroy`, (err, res, body) =>
        {
          Flair.findAll()
          .then((flairs) =>
          {
            expect(err).toBeNull();
            expect(flairs.length).toBe(flairCountBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });

  describe('GET /flairs/:id/edit', () =>
  {
    it('should render a view with an edit flair form', (done) =>
    {
      request.get(`${base}/flairs/${this.flair.id}/edit`, (err, res, body) =>
      {
        expect(err).toBeNull();
        expect(body).toContain('Edit Flair');
        expect(body).toContain('Skiing');
        expect(body).toContain('Green');
        done();
      });
    });
  });

  describe('POST /flairs/:id/update', () =>
  {
    it('should return a status code 302', (done) =>
    {
      request.post({
        url: `${base}/flairs/${this.flair.id}/update`,
        form: 
        {
          name: 'Snowboarding',
          color: 'Blue'
        }
      }, (err, res, body) =>
      {
        expect(res.statusCode).toBe(302);
        done();
      });
    });

    it('should update the flair with the given name', (done) =>
    {
      const options =
      {
        url: `${base}/flairs/${this.flair.id}/update`,
        form:
        {
          name: 'Snowboarding'
        }
      };

      request.post(options, (err, res, body) =>
      {
        expect(err).toBeNull();

        Flair.findOne({
          where: {id: this.flair.id}
        })
        .then((flair) =>
        {
          expect(flair.name).toBe('Snowboarding');
          done();
        });
      });
    });

    it('should update the flair with the given color', (done) =>
    {
      const options =
      {
        url: `${base}/flairs/${this.flair.id}/update`,
        form:
        {
          color: 'Orange'
        }
      };

      request.post(options, (err, res, body) =>
      {
        expect(err).toBeNull();

        Flair.findOne({
          where: {id: this.flair.id}
        })
        .then((flair) =>
        {
          expect(flair.color).toBe('Orange');
          done();
        });
      });
    });
  });
});