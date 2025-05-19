import { expect } from 'chai';
import getNewPasswordMW from '../../../middlewares/getNewPassword.js';

describe('getNewPassword middleware', function () {
  it('should update password and redirect if user exists', function (done) {
    const fakeUser = { username: 'testuser' };
    const mw = getNewPasswordMW({
      UserModel: {
        findOneAndUpdate: (query, update) => {
          expect(query).to.deep.equal({ username: 'testuser' });
          expect(update).to.have.property('password');
          return Promise.resolve(fakeUser);
        }
      }
    });

    const req = { body: { username: 'testuser' } };
    const res = {
      redirectCalled: false,
      redirect: function (url) {
        this.redirectCalled = true;
        expect(url).to.equal('/');
        done();
      },
      status: function () { return this; },
      send: function () {}
    };

    mw(req, res, () => {
      if (!res.redirectCalled) done(new Error('Redirect not called'));
    });
  });

  it('should return 404 if user does not exist', function (done) {
    const mw = getNewPasswordMW({
      UserModel: {
        findOneAndUpdate: () => Promise.resolve(null)
      }
    });

    const req = { body: { username: 'nouser' } };
    const res = {
      statusCalled: false,
      status: function (code) {
        expect(code).to.equal(404);
        this.statusCalled = true;
        return this;
      },
      send: function (msg) {
        expect(msg).to.equal('User not found.');
        done();
      },
      redirect: function () {
        done(new Error('Should not redirect if user not found'));
      }
    };

    mw(req, res, () => {
      if (!res.statusCalled) done(new Error('Status 404 not called'));
    });
  });
});