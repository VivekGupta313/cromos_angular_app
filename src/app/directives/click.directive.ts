import {Directive, HostListener, HostBinding} from '@angular/core';

@Directive({
  selector: '[appClick]',
})
export class ClickDirective {
  @HostBinding('style.backgroundImage') background: string;

  constructor() {}

  @HostListener('change', ['$event'])
  onClick(event) {
    console.log('$event:', event.target.files);
    this.handleInputChange(event);
  }

  handleInputChange(e) {
    // const file = e.dataTransfer ? e.dataTransfer.files[0] : 'null';
    const file = e.target.files[0];
    // this.invalidFlag = false;
    // var pattern = /image-*/;
    const reader = new FileReader();

    // if (!file.type.match(pattern)) {
    //   // this.invalidFlag = true;
    //   alert('invalid format');
    //   // return this.dropHandler.emit({ event: e, invalidFlag: this.invalidFlag });
    // }

    // this.loaded = false;
    // reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.background = `url(${reader.result})`;
    };
  }
  // handleReaderLoaded(e) {
  //   console.log('result:', e.target.result);
  //   this.background = 'url(e.target.result)';
  //   this.className = 'addImage';
  // }
}
