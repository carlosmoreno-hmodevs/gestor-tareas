import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar" [style.width.px]="size()" [style.height.px]="size()" [style.font-size.px]="fontSize()">
      @if (avatarUrl()) {
        <img [src]="avatarUrl()" [alt]="name()" />
      } @else {
        <span class="avatar-initials">{{ initials() }}</span>
      }
    </div>
  `,
  styles: [`
    .avatar {
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-bg-avatar, #e0e0e0);
      color: var(--color-text-avatar, #616161);
      font-weight: 600;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .avatar-initials {
        line-height: 1;
        text-transform: uppercase;
      }
    }
  `]
})
export class AvatarComponent {
  name = input.required<string>();
  avatarUrl = input<string | undefined | null>(undefined);
  size = input<number>(40);

  fontSize = computed(() => Math.round(this.size() * 0.45));

  initials = computed(() => {
    const n = this.name()?.trim() || '';
    if (!n) return '?';
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  });
}
