import {Component, OnInit, ViewChild} from '@angular/core';
import {ContactForm, InitialContactForm} from 'src/app/models/contactForm';
import {access} from 'fs';
import {ContactFormService} from 'src/app/services/contact-form.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  @ViewChild('contactForm') form: NgForm;
  message: ContactForm = InitialContactForm;
  formFields = [
    {
      label: 'Tu nombre*',
      id: 'message.name',
      type: 'text',
      model: this.message.name,
      required: true,
    },
    {
      label: 'Mail*',
      id: 'message.email',
      type: 'text',
      model: this.message.email,
      required: true,
    },
    {
      label: 'Teléfono',
      id: 'message.phone',
      type: 'text',
      model: this.message.phone,
      required: false,
    },
    {
      label: 'Consulta*',
      id: 'message.message',
      type: 'textarea',
      model: this.message.message,
      required: true,
    },
  ];
  constructor(private contactFormService: ContactFormService) {}

  ngOnInit() {}

  sentMail(form: NgForm) {
    this.message.name = this.formFields[0].model;
    this.message.email = this.formFields[1].model;
    this.message.phone = this.formFields[2].model;
    this.message.message = this.formFields[3].model;
    this.contactFormService.addContactForm(this.message).then(() => {
      this.formFields.forEach(obj => (obj.model = ''));
    });
  }
}
