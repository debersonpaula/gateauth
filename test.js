var assert = require('assert');

// instantiate authenticator
const {TGateAuth} = require('./index');
const auth = new TGateAuth;

// values for test
const userlogin = 'testuser';
const userpass = 'testuser';
const userlogin2 = 'testuser2';
const unknown_user = 'unknown_user';
const unknown_pass = 'adfddsfsfd';

// make tests
describe('TGateAuth', () => {
  //-----------------------------------------------------------
  describe('addUser', () => {
    // should return 1
    it('adding new user ' + userlogin, () => {
      assert.equal(auth.addUser(userlogin, userpass), 1);
    });
    // should return 0
    it('adding exist user ' + userlogin, () => {
      assert.equal(auth.addUser(userlogin, userpass), 0);
    });
    // should return 2
    it('adding another user ' + userlogin2, () => {
      assert.equal(auth.addUser(userlogin2, userpass), 2);
    });

  });
  //-----------------------------------------------------------
  describe('searchUserByLogin ', () => {
    // should return 1
    it('searching user ' + userlogin, () => {
      assert.equal(auth.searchUserByLogin(userlogin), 1);
    });
    // should return 2
    it('searching user ' + userlogin2, () => {
      assert.equal(auth.searchUserByLogin(userlogin2), 2);
    });
    // should return 0
    it('searching user ' + unknown_user, () => {
      assert.equal(auth.searchUserByLogin(unknown_user), 0);
    });
  });
  //-----------------------------------------------------------
  describe('checkUser ', () => {
    // should return 1
    it('login user ' + userlogin, () => {
      assert.equal(auth.checkUser(userlogin, userpass), 1);
    });
    // should return 0
    it('login user (with wrong pass) ' + userlogin, () => {
      assert.equal(auth.checkUser(userlogin, unknown_pass), 0);
    });
    // should return 2
    it('login user ' + userlogin2, () => {
      assert.equal(auth.checkUser(userlogin2, userpass), 2);
    });
    // should return 0
    it('login user ' + unknown_user, () => {
      assert.equal(auth.checkUser(unknown_user, userpass), 0);
    });
  });
  //-----------------------------------------------------------
  let acccess1, acccess2, acccess3;
  describe('createAccess ', () => {
    // should return object
    it('create session for user id = 1 (should return object)', () => {
      acccess1 = auth.createAccess(1); // user id = 1
      assert.notEqual(acccess1, undefined);
    });
    // should return object
    it('create session for user id = 2 (should return object)', () => {
      acccess2 = auth.createAccess(2); // user id = 2
      assert.notEqual(acccess2, undefined);
    });
    // should return undefined
    it('create session for user id = 3 (should return undefined)', () => {
      acccess3 = auth.createAccess(3); // fake request
      assert.equal(acccess3, undefined);
    });
  });
  //-----------------------------------------------------------
  describe('checkAccess ', () => {
    it('check session for user id = 1 (should return true)', () => {
      assert.equal(auth.checkAccess(1, acccess1.tokenId), true);
    });
    it('check session for user id = 2 (should return true)', () => {
      assert.equal(auth.checkAccess(2, acccess2.tokenId), true);
    });
    it('check session for user id = 3 (should return false)', () => {
      assert.equal(auth.checkAccess(3, ''), false);
    });
    it('check session for user id = 1 with wrong token (should return false)', () => {
      assert.equal(auth.checkAccess(1, acccess2.tokenId), false);
    });
  });
  //-----------------------------------------------------------
  describe('sessionExpiration ', () => {
    beforeEach(done => {
      setTimeout(function(){
        done();
      }, 500);
    });

    it('assign 1s to session expiration', () => {
      auth.sessionExpiration = 1 * 1000;
      assert.equal(auth.sessionExpiration, 1 * 1000);
    });

    it('re-create session for user id = 1 (consider 1s for expiration)', () => {
      acccess1 = auth.createAccess(1); // user id = 1
      assert.notEqual(acccess1, undefined);
    });

    it('re-check session (after 500ms)', () => {
      assert.equal(auth.checkAccess(1, acccess1.tokenId), true);
    });

    it('re-check session expired (after 1000ms)', () => {
      assert.equal(auth.checkAccess(1, acccess1.tokenId), false);
    });
  });
  //-----------------------------------------------------------
  describe('destroyAccess ', () => {
    auth.sessionExpiration = 60 * 1000;
    
    it('re-create session for user id = 1', () => {
      acccess1 = auth.createAccess(1); // user id = 1
      assert.notEqual(acccess1, undefined);
    });

    it('destroy session', () => {
      assert.equal(auth.destroyAccess(1), true);
    });

    it('check if session was destroyed (shoud return false)', () => {
      assert.equal(auth.checkAccess(1, acccess1.tokenId), false);
    });
  });
  //-----------------------------------------------------------
  describe('File Handling', () => {
    const filename = __dirname + '/test-file.json';
    const auth2 = new TGateAuth;

    it('save to file ' + filename, (done) => {
      auth.saveToFile(filename, (e) => {
        assert.equal(e, undefined);
        done();
      });
    });

    it('load from file ' + filename, (done) => {
      auth2.loadFromFile(filename, (e) => {
        assert.equal(e, undefined);
        done();
      });
    });

    it('check integrity of load file', (done) => {
      assert.equal(auth2._lastId, auth._lastId);
      assert.equal(auth2._users[1].userlogin, auth._users[1].userlogin);
      done();
    });

  });
  //-----------------------------------------------------------
});