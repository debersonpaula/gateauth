import * as http from 'http';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { TUser, TUsers, TAccessToken, TUserHandler } from './Types';
import * as utils from './Utils';
// import * as enums from './Enums';
/*------------------------------------------------------------------------------------*/
export class TGateAuth {
	private _users: TUsers;
	private _lastId: number;
	/** Expiration time (in ms) for the created sessions */
	public sessionExpiration: number;
	/** Event triggered after inclusion on an user */
	public OnUserAdd?: TUserHandler;
	/** Event triggered after change on an user */
	public OnUserChange?: TUserHandler;
	
	/** Create TGateAuth instance */
	constructor() {
		this._users = {};
		this._lastId = 0;
		this.sessionExpiration = utils.AddDays(0, 1);
	}

	/** List of Users */
	public get users(): TUsers {
		return this._users;
	}
	
	/** Register New User (if not exists) */
	public addUser(userlogin: string, userpass: string, data?: any): number {
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
	public checkUser(userlogin: string, userpass: string): number {
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
	public searchUserByLogin(userlogin: string): number {
		// let i: number;
		for (let i in this._users) {
			if (userlogin === this._users[i].userlogin) {
				return parseInt(i);
			}
		}
		return 0;
	}

	/** Create a Session */
	public createAccess(id: number): TAccessToken | undefined {
		if (id) {
			const user = this._users[id];
			if (user) {
				if (user.access) {
					user.access.expires = Date.now() + this.sessionExpiration
				} else {
					user.access = {
						expires: Date.now() + this.sessionExpiration,
						tokenId: crypto.randomBytes(32).toString('hex')
					}
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
	public checkAccess(id: number, tokenId: string): boolean {
		if (id) {
			const user = this._users[id];
			if (user) {
				const access = user.access;
				if (access) {
					return access.tokenId === tokenId && access.expires > Date.now();
				}
			}
		}
		return false;
	}

	/** Destroy Session */
	public destroyAccess(id: number): boolean {
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
	public saveToFile(filename: string, callback?: any) {
		const data = {
			lastId: this._lastId,
			users: this._users
		};
		fs.writeFile(filename, JSON.stringify(data), 'utf8', callback);
	}

	/** Load Users List from file */
	public loadFromFile(filename: string, callback?: any) {
		fs.readFile(filename, (err, result: any) => {
			if (err) callback && callback(err);
			try {
				const data = JSON.parse(result);
				this._lastId = data.lastId;
				this._users = data.users;
				callback && callback();
			} catch(e) {
				callback && callback(e);
			}
		});
	}

	/** Add an user */
	private add(userlogin: string, userpass: string, data?: any): number {
		const newUser: TUser = {userlogin, userpass, data};
		this._lastId++;
		this._users[this._lastId] = newUser;
		if (this.OnUserAdd) {
			this.OnUserAdd(this._lastId, newUser);
		}
		return this._lastId;
	}
}