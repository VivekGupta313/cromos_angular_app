import {Component} from '@angular/core';

import {ICellRendererAngularComp} from 'ag-grid-angular';
@Component({
  selector: 'app-card-cell',
  styleUrls: ['./card-renderer.component.scss'],
  template: `
    <img [src]="url" alt="no image rendered" />
  `,
})
export class CardRendererComponent implements ICellRendererAngularComp {
  private params: any;
  url: string;

  // called on init
  agInit(params: any): void {
    // console.log('params:', params);
    this.url = params.value;
  }

  // // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    this.url = this.params;
    return true;
  }

  public valueUrl(): string {
    return this.url;
  }
}
