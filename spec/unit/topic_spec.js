const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;

describe('Topic', () =>
{
  beforeEach((done) =>
  {
    sequelize.sync({force: true}).then((res) =>
    {
      this.topic;
      this.post;

      Topic.create({
        title: 'Toronto Maple Leafs',
        description: 'NHL team based out of Toronto, Ontario.'
      })
      .then((topic) =>
      {
        this.topic = topic;
        
        Post.create({
          title: 'Auston Matthews',
          body: 'Leading goal scorer of the Toronto Maple Leafs.',
          topicId: this.topic.id
        })
        .then((post) =>
        {
          this.post = post;
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
        title: 'Boston Bruins',
        description: 'NHL team based out of Boston.'
      })
      .then((topic) =>
      {
        expect(topic.title).toBe('Boston Bruins');
        expect(topic.description).toBe('NHL team based out of Boston.');
        done();
      })
      .catch((err) =>
      {
        console.log(err);
        done();
      });
    });

    it('should not create a topic with missing description', (done) =>
    {
      Topic.create({
        title: 'Montreal Canadiens'
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
        description: 'NHL team based out of Montreal.'
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
        title: 'Montreal Canadiens',
        description: 'NHL team based out of Montreal.'
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
        expect(posts[0].title).toBe('Auston Matthews');
        expect(posts[0].body).toBe('Leading goal scorer of the Toronto Maple Leafs.');
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
        title: 'William Nylander signed contract worth $41.77 million over 6 years.',
        body: 'Finally!!!',
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
            expect(posts[0].title).toBe('Auston Matthews');
            expect(posts[0].body).toBe('Leading goal scorer of the Toronto Maple Leafs.');
            expect(posts[1].title).toBe('William Nylander signed contract worth $41.77 million over 6 years.');
            expect(posts[1].body).toBe('Finally!!!');

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