import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeProposalComponent } from './exchange-proposal.component';

describe('ExchangeProposalComponent', () => {
  let component: ExchangeProposalComponent;
  let fixture: ComponentFixture<ExchangeProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
