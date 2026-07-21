import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { IconName, ICONS_MAP } from './app-icons.registry';

@Directive({
  selector: 'svg[appIcon]',
  standalone: true,
})
export class AppIconsDirective implements OnChanges {
  private readonly el = inject<ElementRef<SVGAElement>>(ElementRef);

  @Input('appIcon') iconName!: IconName;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iconName']) {
      this.renderIcon();
    }
  }

  private renderIcon(): void {
    const svg = this.el.nativeElement;
    const icon = ICONS_MAP[this.iconName];

    if (icon) {
      svg.setAttribute('viewBox', icon.viewBox);
      svg.setAttribute('fill', 'none');
      svg.innerHTML = icon.path;
    }
  }
}
