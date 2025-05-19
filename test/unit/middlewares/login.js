import { expect } from 'chai';
import loginMW from '../../../middlewares/login.js';

describe('login middleware', function () {
  it('should redirect to /calorie_counter if already logged in', function (done) {
    const mw = loginMW({ UserModel: {} });
    const req = { session: { loggedIn: true } };
    const res = {
      redirect: function (url) {
        expect(url).to.equal('/calorie_counter');
        done();
      }
    };
    mw(req, res, () => done(new Error('Should not call next')));
  });

  it('should render index with error if user not found', function (done) {
    const mw = loginMW({
      UserModel: {
        findOne: () => Promise.resolve(null)
      }
    });
    const req = { body: { username: 'nouser' }, session: {} };
    const res = {
      render: function (view, data) {
        expect(view).to.equal('index');
        expect(data.error).to.equal('User not found.');
        done();
      }
    };
    mw(req, res, () => done(new Error('Should not call next')));
  });

  it('should render index with error if password is incorrect', function (done) {
    const mw = loginMW({
      UserModel: {
        findOne: () => Promise.resolve({ username: 'user', password: 'correct' })
      }
    });
    const req = { body: { username: 'user', password: 'wrong' }, session: {} };
    const res = {
      render: function (view, data) {
        expect(view).to.equal('index');
        expect(data.error).to.equal('Password is not correct.');
        done();
      }
    };
    mw(req, res, () => done(new Error('Should not call next')));
  });

  it('should set session and redirect on successful login', function (done) {
    const user = {
      username: 'user',
      password: 'pass',
      goal_calories: 2000,
      consumed_calories: 0,
      consumed_carbs: 0,
      consumed_proteins: 0,
      consumed_fats: 0,
      meals: []
    };
    const mw = loginMW({
      UserModel: {
        findOne: () => Promise.resolve(user)
      }
    });
    const req = { body: { username: 'user', password: 'pass' }, session: {} };
    const res = {
      redirect: function (url) {
        expect(url).to.equal('/calorie_counter');
        expect(req.session.loggedIn).to.be.true;
        expect(req.session.user).to.include({ username: 'user', goal_calories: 2000 });
        done();
      }
    };
    // Simulate session.save
    req.session.save = (cb) => cb && cb();
    mw(req, res, () => done(new Error('Should not call next')));
  });
});