import { Directive, ElementRef, HostListener, Input, OnInit, Renderer } from '@angular/core';

@Directive({
  selector: '[app-i18n]'
})
export class I18nDirective implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer) { }

  @Input('app-i18n') name: string;

  ngOnInit() {
    let message = browser.i18n.getMessage(this.name);
    if (message) {
      this.renderer.setElementProperty(this.el.nativeElement, 'innerHTML', message);
    }
  }
}
