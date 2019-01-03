const favoriteQueries = require('../db/queries.favorites');

module.exports =
{
  create(req, res, next)
  {
    if (req.user)
    {
      favoriteQueries.createFavorite(req, (err, favorite) =>
      {
        if (err)
        {
          req.flash('errors', err);
        }
        res.redirect(req.headers.referer);
      });
    }
    else
    {
      req.flash('notice', 'You must be signed in to do that.');
      res.redirect(req.headers.referer);
    }
  },
  destroy(req, res, next)
  {
    if (req.user)
    {
      favoriteQueries.deleteFavorite(req, (err, favorite) =>
      {
        if (err)
        {
          req.flash('errors', err);
        }
        res.redirect(req.headers.referer);
      });
    }
    else
    {
      req.flash('notice', 'You must be signed in to do that.');
      res.redirect(req.headers.referer);
    }
  }
};