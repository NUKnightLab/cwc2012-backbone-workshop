$(function(){
  // use a hard-coded id so that it always fetches
  // the same value from localstorage
  window.user = new UserModel({id: 1});
  window.user.fetch();

  var router = new Router;

  // we always want to pass true, so this wraps
  // that extra work
  window.navigate = function(path){
    router.navigate(path, true);
  };

  Backbone.history.start();
});

var Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    'timeline': 'timeline',
    'signup': 'signup'
  },

  index: function(){
    if(window.user.get('name') == null) {
      window.navigate('/signup');
    } else {
      window.navigate('/timeline');
    }
  },

  signup: function(){
    var view = new SignupView;
    view.render();

    $('#container').children().remove();
    $('#container').append(view.el);
  },

  timeline: function(){
    if(window.user.get('name') == null) {
      window.navigate('/signup');
      return;
    }

    var posts = new PostCollection();
    posts.fetch();
    var statusView = new CreateStatusView({model: window.user});
    var postsView = new PostCollectionView({collection: posts});
    $('#container')
        .append(statusView.el)
        .append('<hr>')
        .append(postsView.el);
    statusView.render();
    postsView.render();
  }
});

var SignupView = Backbone.View.extend({
  template: '<form class="form-inline"><input type="text" placeholder="user name" /><button class="btn btn-primary">Sign In</button></form>',
  events: {
    'click button': 'submit'
  },
  render: function(){
    var html = Mustache.render(this.template, this.model.attributes);
    this.$el.html(html);
  },
  submit: function(){
    var name = this.$('input').val();
    window.user.set('name', name);
    window.user.save();

    window.navigate('/timeline');
  }
});

var UserModel = Backbone.Model.extend({
  localStorage: new Store('User')
});

var PostModel = Backbone.Model.extend({
});

var PostCollection = Backbone.Collection.extend({
    //sync: function(){ alert('syncing PostCollection') }
    model: PostModel,
    localStorage: new Store('PostCollection')
});

var PostView = Backbone.View.extend({
  template: '{{ username }}',
  events: {
  },
  render: function(){
    var context = {
        username: window.user.get('name'),
    };
    var html = Mustache.render(this.template, context);
    this.$el.html(html);
  },
});

var PostCollectionView = Backbone.View.extend({
    className: 'posts',
    initialize: function() {
        this.collection.bind('add', this.postAdded, this.model)
    },
    postAdded: function(model){
        var postView = new PostView({ model: model });
        this.renderView(postView);
    },
    renderView: function(view) {
        view.render()
        this.$el.prepend(view.el)
    },
    render: function() {
        var view = this;
        this.collection.each(function(post){
            var postView = new PostView({model: post});
            view.renderView(postView);
        });
    }
});

var CreateCommentView = Backbone.View.extend({
});

var CommentCollection = Backbone.Collection.extend({
});

var CommentView = Backbone.View.extend({
});

var CommentCollectionView = Backbone.View.extend({
});

var CreateStatusView = Backbone.View.extend({
  template: '<form class="form-inline">{{ username }} <input type="text" placeholder="Status" /><button class="btn btn-post">Post</button></form><button class="btn btn-logout">logout</button>',
  events: {
    'click button.btn-post': 'submit',
    'click button.btn-logout': 'logout'
  },
  render: function(){
    var context = {
        username: window.user.get('name')
    };
    var html = Mustache.render(this.template, context);
    this.$el.html(html);
  },
  submit: function(){
    var status = this.$('input').val();
    window.post.set('status', status);
    window.post.save();

    window.navigate('/timeline');
  },
  logout: function() {
    alert('logout');
  }
});

