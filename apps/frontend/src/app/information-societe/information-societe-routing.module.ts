import { AProposOttawaPigeonComponent } from './a-propos-ottawa-pigeon/a-propos-ottawa-pigeon.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [{ path: 'apropos', component:AProposOttawaPigeonComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationSocieteRoutingModule { }
