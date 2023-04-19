import { PersonalData } from './personal-data.model';
export interface User extends PersonalData{
  password:string,
  newsletter:boolean,
}
