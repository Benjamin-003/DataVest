import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html'
})
export class PersonalDataComponent implements OnChanges {
  @Input() personalData = { surname: "", firstname: "", birth_date: "", address: "", city: "", zip_code: "", country: "" }
  birth_date: Date = new Date()

  ngOnChanges(changes: SimpleChanges) {
    this.birth_date = new Date(changes['personalData'].currentValue.birth_date)
  }
}
