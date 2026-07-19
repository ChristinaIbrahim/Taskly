import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IconName, ICONS_MAP } from './app-icons.registry';
@Directive({
  selector: 'svg[app-icon]',
  standalone: true,
})
export class AppIconsDirective implements OnChanges {
  @Input('app-icon') iconName!: IconName;

  constructor(private el: ElementRef<SVGAElement>) {}

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
    } else {
    }
  }
}
