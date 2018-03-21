export interface TAccessToken {
    tokenId: string;
    expires: number;
}
export interface TUser {
    userlogin: string;
    userpass: string;
    data?: any;
    access?: TAccessToken;
}
export declare type TUsers = {
    [key: number]: TUser;
};
export declare type TUserHandler = (id: number, user: TUser) => void;
