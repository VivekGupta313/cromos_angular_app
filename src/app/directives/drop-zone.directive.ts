import {
  Directive,
  Output,
  EventEmitter,
  HostListener,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[appDropZone]',
})
export class DropZoneDirective {
  @Output() dropped = new EventEmitter<FileList>();
  @Output() hovered = new EventEmitter<boolean>();

  @HostBinding('class') className: string;
  @HostBinding('style.backgroundImage') background: string;

  constructor() {}
  @HostListener('drop', ['$event'])
  onDrop($event) {
    console.log('image is dropped');
    $event.preventDefault();
    this.dropped.emit($event.dataTransfer.files);
    this.hovered.emit(false);
    this.className = 'hasImage';
    this.handleInputChange($event);
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event) {
    $event.preventDefault();
    this.hovered.emit(true);
    this.className = 'dragging';
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event) {
    $event.preventDefault();
    this.hovered.emit(true);
    this.className = '';
  }

  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : 'null';
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
      // this.className = 'hasImage';
    };
  }
  // handleReaderLoaded(e) {
  //   console.log('result:', e.target.result);
  //   this.background = 'url(e.target.result)';
  //   this.className = 'addImage';
  // }
}
