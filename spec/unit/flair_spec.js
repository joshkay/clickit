const sequelize = require('../../src/db/models/index').sequelize;
const Flair = require('../../src/db/models').Flair;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;

describe('Flair', () =>
{
  beforeEach((done) =>
  {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({force: true}).then((res) =>
    {
      Topic.create({
        title: 'Expeditions to Alpha Centauri',
        description: 'A compilation of reports from recent visits to the star system.'
      })
      .then((topic) =>
      {
        this.topic = topic;

        Post.create({
          title: 'My first visit to Proxima Centauri b',
          body: 'I saw some rocks.',
          topicId: this.topic.id
        })
        .then((post) =>
        {
          this.post = post;

          Flair.create({
            name: 'Experience',
            color: 'Yellow'
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

  describe('#create()', () =>
  {
    it('should create a flair object with a name and color', (done) =>
    {
      Flair.create({
        name: 'Verified',
        color: 'Green'
      })
      .then((flair) =>
      {
        expect(flair).not.toBeNull();
        expect(flair.name).toBe('Verified');
        expect(flair.color).toBe('Green');
        done();
      })
      .catch((err) =>
      {
        console.log(err);
        done();
      });
    });

    it('should not create a flair object with a missing name', (done) =>
    {
      Flair.create({
        color: 'Green'
      })
      .then((flair) =>
      {
        done();
      })
      .catch((err) =>
      {
        expect(err.message).toContain('Flair.name cannot be null');
        done();
      });
    });
    
    it('should not create a flair object with a missing color', (done) =>
    {
      Flair.create({
        name: 'Verified'
      })
      .then((flair) =>
      {
        done();
      })
      .catch((err) =>
      {
        expect(err.message).toContain('Flair.color cannot be null');
        done();
      });
    });
  });

  describe('#getTopics()', () =>
  {
    it('should get all topics that are associated with a flair', (done) =>
    {
      this.flair.getTopics()
      .then((topics) =>
      {
        expect(topics.length).toBe(0);

        this.flair.addTopic(this.topic)
        .then((topicFlair) =>
        {
          this.flair.getTopics()
          .then((topics) =>
          {
            expect(topics.length).toBe(1);
            expect(topics[0].id).toBe(this.topic.id);
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

  describe('#addTopic()', () =>
  {
    it('should associate a topic and flair together', (done) =>
    {
      this.flair.addTopic(this.topic)
      .then((topicFlair) =>
      {
        this.flair.getTopics()
        .then((topics) =>
        {
          expect(topics.length).toBe(1);
          expect(topics[0].id).toBe(this.topic.id);
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

  describe('#getPosts()', () =>
  {
    it('should get all posts that are associated with a flair', (done) =>
    {
      this.flair.getPosts()
      .then((posts) =>
      {
        expect(posts.length).toBe(0);

        this.flair.addPost(this.post)
        .then((postFlair) =>
        {
          this.flair.getPosts()
          .then((posts) =>
          {
            expect(posts.length).toBe(1);
            expect(posts[0].id).toBe(this.post.id);
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

  describe('#addPost()', () =>
  {
    it('should associate a post and flair together', (done) =>
    {
      this.flair.addPost(this.post)
      .then((postFlair) =>
      {
        this.flair.getPosts()
        .then((posts) =>
        {
          expect(posts.length).toBe(1);
          expect(posts[0].id).toBe(this.post.id);
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