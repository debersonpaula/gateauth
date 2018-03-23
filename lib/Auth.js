"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const fs = require("fs");
const utils = require("./Utils");
// import * as enums from './Enums';
/*------------------------------------------------------------------------------------*/
class TGateAuth {
    /** Create TGateAuth instance */
    constructor() {
        this._users = {};
        this._lastId = 0;
        this.sessionExpiration = utils.AddDays(0, 1);
    }
    /** List of Users */
    get users() {
        return this._users;
    }
    /** Register New User (if not exists) */
    addUser(userlogin, userpass, data) {
        // search if user already exists
        const searchUser = this.searchUserByLogin(userlogin);
        if (!searchUser) {
            // register user
            const id = this.add(userlogin, userpass, data);
            return id;
        }
        return 0;
    }
    /** Check if user exists and the passwords matches */
    checkUser(userlogin, userpass) {
        const id = this.searchUserByLogin(userlogin);
        if (id) {
            const user = this._users[id];
            if (user.userpass === userpass) {
                return id;
            }
        }
        return 0;
    }
    /** Find an user by userlogin */
    searchUserByLogin(userlogin) {
        // let i: number;
        for (let i in this._users) {
            if (userlogin === this._users[i].userlogin) {
                return parseInt(i);
            }
        }
        return 0;
    }
    /** Create a Session */
    createAccess(id) {
        if (id) {
            const user = this._users[id];
            if (user) {
                if (user.access) {
                    user.access.expires = Date.now() + this.sessionExpiration;
                }
                else {
                    user.access = {
                        expires: Date.now() + this.sessionExpiration,
                        tokenId: crypto.randomBytes(32).toString('hex')
                    };
                }
                if (this.OnUserChange) {
                    this.OnUserChange(id, user);
                }
                return user.access;
            }
        }
        return undefined;
    }
    /** Check Session */
    checkAccess(id, tokenId) {
        if (id) {
            const user = this._users[id];
            if (user) {
                const access = user.access;
                if (access) {
                    if (access.expires < Date.now()) {
                        this.destroyAccess(id);
                        return false;
                    }
                    else {
                        return access.tokenId === tokenId;
                    }
                }
            }
        }
        return false;
    }
    /** Destroy Session */
    destroyAccess(id) {
        if (id) {
            const user = this._users[id];
            if (user) {
                user.access = undefined;
                return true;
            }
        }
        return false;
    }
    /** Save Users List to file */
    saveToFile(filename, callback) {
        const data = {
            lastId: this._lastId,
            users: this._users
        };
        fs.writeFile(filename, JSON.stringify(data), 'utf8', callback);
    }
    /** Load Users List from file */
    loadFromFile(filename, callback) {
        fs.readFile(filename, (err, result) => {
            if (err)
                callback && callback(err);
            try {
                const data = JSON.parse(result);
                this._lastId = data.lastId;
                this._users = data.users;
                callback && callback();
            }
            catch (e) {
                callback && callback(e);
            }
        });
    }
    /** Add an user */
    add(userlogin, userpass, data) {
        const newUser = { userlogin, userpass, data };
        this._lastId++;
        this._users[this._lastId] = newUser;
        if (this.OnUserAdd) {
            this.OnUserAdd(this._lastId, newUser);
        }
        return this._lastId;
    }
}
exports.TGateAuth = TGateAuth;
