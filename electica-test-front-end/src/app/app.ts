import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="app-shell">
      <header class="app-header">
        <div class="app-header__title">Electica</div>
      </header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('electica-test-front-end');
}
