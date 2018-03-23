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
export type TUsers = { [key: number] : TUser };
export type TUserHandler = (id?: number, user?: TUser) => void;