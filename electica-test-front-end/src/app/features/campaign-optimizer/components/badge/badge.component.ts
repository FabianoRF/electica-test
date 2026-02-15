import { Component, input } from '@angular/core';

export type BadgeVariant = 'primary' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  text = input.required<string>();
  variant = input<BadgeVariant>('primary');
  hidden = input<boolean>(false);
}
