import { UserService } from '../../../users/services/user-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html'
})
export class UserSettingsComponent implements OnInit {
  public personalData = { surname: "", firstname: "", birth_date: "", address: "", city: "", zip_code: "", country: "" }
  constructor(private readonly userSettings: UserService,
  ) { }

  ngOnInit() {
    this.userSettings.currentLoggedUser.subscribe(idResult => {
      this.userSettings.getUser(idResult.id).subscribe(
        (resultPersonnalData: any) => {
          this.personalData = resultPersonnalData
          this.personalData.birth_date = new Date(this.personalData.birth_date + "+00:00").toISOString()
        }
      )
    }
    )
  }
}
