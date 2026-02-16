import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
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
export class AppComponent {
  protected readonly title = signal('electica-test-front-end');
}
