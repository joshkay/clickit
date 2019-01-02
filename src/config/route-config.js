module.exports = 
{
  init(app)
  {
    const staticRoutes = require('../routes/static');
    const topicRoutes = require('../routes/topics');
    const postRoutes = require('../routes/posts');
    const userRoutes = require('../routes/users');
    const advertisementRoutes = require('../routes/advertisements');
    const flairRoutes = require('../routes/flairs');
    const commentRoutes = require('../routes/comments');
    const voteRoutes = require('../routes/votes');

    if (process.env.NODE_ENV === 'test')
    {
      const mockAuth = require('../../spec/support/mock-auth');
      mockAuth.fakeIt(app);
    }

    app.use(staticRoutes);
    app.use(topicRoutes);
    app.use(postRoutes);
    app.use(userRoutes);
    app.use(advertisementRoutes);
    app.use(flairRoutes);
    app.use(commentRoutes);
    app.use(voteRoutes);
  }
}