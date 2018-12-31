const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const User = require('../../src/db/models').User;

describe('Post', () =>
{
  beforeEach((done) =>
  {
    this.topic;
    this.post;
    this.user;

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
          posts: [{
            title: 'My first visit to Proxima Centauri b',
            body: 'I saw some rocks.',
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
          done();
        });
      })
      .catch((err) =>
      {
        console.log(err);
        done();
      })
    });
  });

  describe('#create()', () =>
  {
    it('should create a topic object with a title and description', (done) =>
    {
      Topic.create({
        title: 'Cryosleep',
        description: "Why isn't this a thing yet?",
      })
      .then((topic) =>
      {
        expect(topic.title).toBe('Cryosleep');
        expect(topic.description).toBe("Why isn't this a thing yet?");
        done();
      })
      .catch((err) =>
      {
        console.log(err);
        done();
      });
    });

    it('should not create a topic with missing title or description', (done) =>
    {
      Topic.create({
        title: 'Cryosleep'
      })
      .then((topic) =>
      {
        done();
      })
      .catch((err) =>
      {
        expect(err.message).toContain('Topic.description cannot be null');
        done();
      });
    });
  });
});