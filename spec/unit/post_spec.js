const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const Flair = require('../../src/db/models').Flair;

describe('Post', () =>
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

            this.post.addFlair(this.flair)
            .then((postFlair) =>
            {
              done();
            });
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
    it('should create a post object with a title, body, and assigned topic', (done) =>
    {
      Post.create({
        title: 'Pros of Cryosleep during the long journey',
        body: "1. Not having to answer the 'are we there yet?' question.",
        topicId: this.topic.id
      })
      .then((post) =>
      {
        expect(post.title).toBe('Pros of Cryosleep during the long journey');
        expect(post.body).toBe("1. Not having to answer the 'are we there yet?' question.");
        done();
      })
      .catch((err) =>
      {
        console.log(err);
        done();
      });
    });

    it('should not create a post with missing title, body, or assigned topic', (done) =>
    {
      Post.create({
        title: 'Pros of Cryosleep during the long journey'
      })
      .then((post) =>
      {
        done();
      })
      .catch((err) =>
      {
        expect(err.message).toContain('Post.body cannot be null');
        expect(err.message).toContain('Post.topicId cannot be null');
        done();
      });
    });
  });

  describe('#setTopic()', () => 
  {
    it('should associate a topic and a post together', (done) => 
    {
      Topic.create({
        title: 'Challenges of interstellar travel',
        description: '1. The Wi-Fi is terrible'
      })
      .then((newTopic) => 
      {
        expect(this.post.topicId).toBe(this.topic.id);
        
        this.post.setTopic(newTopic)
        .then((post) => 
        {
          expect(post.topicId).toBe(newTopic.id);
          done();
        });
      });
    });
  });

  describe('#getTopic()', () => 
  {
    it('should return the associated topic', (done) => 
    {
      this.post.getTopic()
      .then((associatedTopic) => 
      {
        expect(associatedTopic.title).toBe('Expeditions to Alpha Centauri');
        done();
      });
    });
  });

  describe('#addFlair()', () =>
  {
    it('should associate a flair with a post', (done) =>
    {
      Flair.create({
        name: 'Verified',
        color: 'Green'
      })
      .then((flair) =>
      {
        this.post.addFlair(flair)
        .then((postFlair) =>
        {
          this.post.getFlairs()
          .then((flairs) =>
          {
            expect(flairs.length).toBe(2);
            expect(flairs[0].id).toBe(this.flair.id);
            expect(flairs[0].name).toBe('Experience');
            expect(flairs[1].id).toBe(flair.id);
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

  describe('#getFlairs()', () =>
  {
    it('should get all flairs associated with the post', (done) =>
    {
      this.post.getFlairs()
      .then((flairs) =>
      {
        expect(flairs.length).toBe(1);
        expect(flairs[0].id).toBe(this.flair.id);
        expect(flairs[0].name).toBe('Experience');
        done();
      })
      .catch((err) =>
      {
        console.log(err);
        done();
      });
    });
  });

  describe('#delete()', () =>
  {
    it('should delete the post', (done) =>
    {
      Post.findAll()
      .then((posts) =>
      {
        const postCountBeforeDelete = posts.length;

        this.post.getFlairs()
        .then((flairs) =>
        {
          expect(flairs.length).toBe(1);
          const flairId = flairs[0].id;

          this.post.destroy()
          .then(() =>
          {
            Post.findAll()
            .then((posts) =>
            {
              expect(posts.length).toBe(postCountBeforeDelete - 1);
              done();
            });
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