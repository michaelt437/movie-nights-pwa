import IUser from '../interface/IUser'

export default class User implements IUser {
  constructor (
    public created: number,
    public email: string,
    public hasRolled: boolean,
    public hasPicked: boolean,
    public name: string,
    public pickedDateTime: number,
    public rolls: number,
    public rollTime: number) {}
};
