import { TUsers, TAccessToken, TUserHandler } from './Types';
export declare class TGateAuth {
    private _users;
    private _lastId;
    /** Expiration time (in ms) for the created sessions */
    sessionExpiration: number;
    /** Event triggered after inclusion on an user */
    OnUserAdd?: TUserHandler;
    /** Event triggered after change on an user */
    OnUserChange?: TUserHandler;
    /** Create TGateAuth instance */
    constructor();
    /** List of Users */
    readonly users: TUsers;
    /** Register New User (if not exists) */
    addUser(userlogin: string, userpass: string, data?: any): number;
    /** Check if user exists and the passwords matches */
    checkUser(userlogin: string, userpass: string): number;
    /** Find an user by userlogin */
    searchUserByLogin(userlogin: string): number;
    /** Create a Session */
    createAccess(id: number): TAccessToken | undefined;
    /** Check Session */
    checkAccess(id: number, tokenId: string): boolean;
    /** Destroy Session */
    destroyAccess(id: number): boolean;
    /** Save Users List to file */
    saveToFile(filename: string, callback?: any): void;
    /** Load Users List from file */
    loadFromFile(filename: string, callback?: any): void;
    /** Add an user */
    private add(userlogin, userpass, data?);
}
