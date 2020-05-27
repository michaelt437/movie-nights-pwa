export default interface IUser {
  created: number;
  email: string;
  hasRolled: boolean;
  hasPicked: boolean;
  name: string;
  pickedDateTime: number;
  rolls: number;
  rollTime: number;
}
