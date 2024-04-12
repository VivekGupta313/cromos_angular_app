import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.scss']
})
export class SiteFooterComponent implements OnInit {
  socLinks = [
    {
      title: 'Facebook',
      link: 'https://facebook.com',
      icon: 'assets/img/facebook-icon.svg'
    },
    {
      title: 'Instagram',
      link: 'https://instagram.com',
      icon: 'assets/img/instagram-icon.svg'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
