import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationSocieteComponent } from './information-societe.component';

const routes: Routes = [{ path: '', component: InformationSocieteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationSocieteRoutingModule { }
