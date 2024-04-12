import {
  Directive,
  TRANSLATIONS_FORMAT,
  Input,
  OnInit,
  HostBinding,
  Renderer2,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[appPileOfCards]',
})
export class CardsDirective implements OnInit {
  @Input() translator;
  @HostBinding('style.transform') transform;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.transform = `translate3d(${this.translator}%,-${this.translator}%,0)`;
  }
}
