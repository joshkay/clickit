module.exports = 
{
  index(req, res, next)
  {
    res.render('static/index');
  },
  about(req, res, next)
  {
    res.render('static/about');
  }
};