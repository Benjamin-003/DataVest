import { UserResolverService } from './../users/services/user-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';

const routes: Routes = [{ path: '', component: UserSettingsComponent, resolve: {
  user: UserResolverService
} }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule { }

