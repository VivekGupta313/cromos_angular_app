import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsExchangeComponent } from './cards-exchange.component';

describe('CardsExchangeComponent', () => {
  let component: CardsExchangeComponent;
  let fixture: ComponentFixture<CardsExchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsExchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
