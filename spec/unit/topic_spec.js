const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const User = require('../../src/db/models').User;

describe('Topic', () =>
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
      });
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

    it('should not create a topic with missing title', (done) =>
    {
      Topic.create({
        description: "Why isn't this a thing yet?"
      })
      .then((topic) =>
      {
        done();
      })
      .catch((err) =>
      {
        expect(err.message).toContain('Topic.title cannot be null');
        done();
      });
    });
  });

  describe('#getPosts()', () =>
  {
    it('should return nothing when a topic has no posts', (done) =>
    {
      Topic.create({
        title: 'Space Things',
        description: 'Stuff about space.'
      })
      .then((topic) =>
      {
        topic.getPosts()
        .then((posts) =>
        {
          expect(posts.length).toBe(0);
          done();
        });
      })
      .catch((err) =>
      {
        console.log(err);
        done();
      });
    });

    it('should return all posts associated with a topic', (done) =>
    {
      this.topic.getPosts()
      .then((posts) =>
      {
        expect(posts.length).toBe(1);
        expect(posts[0].title).toBe('My first visit to Proxima Centauri b');
        expect(posts[0].body).toBe('I saw some rocks.');
        expect(posts[0].userId).toBe(this.user.id);
        done();
      })
      .catch((err) =>
      {
        console.log(err);
        done();
      });
    });

    it('should return existing posts and newly added post associated with a topic', (done) =>
    {
      Post.create({
        title: 'My second visit to Proxima Centauri b',
        body: 'I saw some more rocks.',
        userId: this.user.id,
        topicId: this.topic.id
      })
      .then((post) =>
      {
        expect(post.topicId).toBe(this.topic.id);

        this.topic.addPost(post)
        .then((topic) =>
        {
          topic.getPosts()
          .then((posts) =>
          {
            expect(posts.length).toBe(2);  
            expect(posts[0].title).toBe('My first visit to Proxima Centauri b');
            expect(posts[0].body).toBe('I saw some rocks.');
            expect(posts[0].userId).toBe(this.user.id);
            expect(posts[1].title).toBe('My second visit to Proxima Centauri b');
            expect(posts[1].body).toBe('I saw some more rocks.');
            expect(posts[1].userId).toBe(this.user.id);

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
});