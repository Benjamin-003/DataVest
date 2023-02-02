import { PersonalData } from './personal-data.model';
export interface User extends PersonalData{
  mail:string
  password:string,
  newsletter:boolean
}
