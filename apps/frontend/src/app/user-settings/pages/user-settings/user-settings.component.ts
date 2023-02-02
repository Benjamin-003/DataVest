import { PersonalData } from './../../../users/interfaces/personal-data.model';
import { User } from './../../../users/interfaces/user.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html'
})
export class UserSettingsComponent implements OnInit{
  public personalData!:PersonalData

  constructor(private router: ActivatedRoute) {}

  ngOnInit(){
    this.router.data.subscribe(data=>{ this.personalData = data['user']})
  }
  updatePersonnalInformation(updatedDataUser:User){
    //Ici on appelle la méthode du back
  }
}
