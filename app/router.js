import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('gist', {path: '/'}, function() {
    this.route('new', {path: '/'});
    // eslint-disable-next-line
    this.route('edit', {path: '/:gistId'}, function() {
      this.route('copy');
      // eslint-disable-next-line
      this.route('revision', {path: '/:revId'});
    });
  });
  this.route('twiddles');
  this.route('catchall', { path: '*:' });
});
