const ApplicationPolicy = require('./application');

module.exports = class PostPolicy extends ApplicationPolicy
{
  new()
  {
    return this._isMember() || this._isAdmin();
  }

  create()
  {
    return this.new();
  }

  show()
  {
    return true;
  }

  edit()
  {
    return this._isOwner() || this._isAdmin();
  }
  
  update()
  {
    return this.edit();
  }

  destroy()
  {
    return this.update();
  }
};