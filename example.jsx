Posts = new Mongo.Collection('posts');

Layout = React.createClass({
  render() {
    return (
      <div>
        <a href="/post/post-1">post 1</a>
        <a href="/post/post-2">post 2</a>
        <a href="/post/post-3">post 3</a>
        <a href="/">home</a>
        <hr />
        {this.props.content}
      </div>
    );
  }
});

Home = React.createClass({
  render() {
    return (
      <div>Home</div>
    );
  }
});

Post = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var subscription = Meteor.subscribe('post', this.props.params.slug);
    return {
      ready: subscription.ready(),
      post: Posts.findOne({ slug: this.props.params.slug })
    };
  },
  render() {
    if (! this.data.ready) {
      return <div>Loading...</div>;
    }
    if (! this.data.post) {
      return <div>404: Not found</div>;
    }
    return <div>Post: {this.data.post.title}</div>;
  }
});

Reaktor.init(
  <Router>
    <Route path="/" layout={Layout} content={Home} />
    <Route path="/post/:slug" layout={Layout} content={Post} />
  </Router>
);

if (Meteor.isServer) {
  if (Posts.find().count() === 0) {
    Posts.insert({ slug: 'post-1', title: 'Post 1' });
    Posts.insert({ slug: 'post-2', title: 'Post 2' });
    Posts.insert({ slug: 'post-3', title: 'Post 3' });
  }

  Meteor.publish('post', function(slug) {
    check(slug, String);
    return Posts.find({ slug: slug });
  });
}
