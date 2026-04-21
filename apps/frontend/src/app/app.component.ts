import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';

/**
 * Changements vs v14 :
 * - standalone: true  (obligatoire pour bootstrapApplication())
 * - imports: [RouterOutlet, HeaderComponent] au lieu de AppModule
 * - Plus de 'export class AppComponent implements AppModule' implicite
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ottawa-pigeon';
}