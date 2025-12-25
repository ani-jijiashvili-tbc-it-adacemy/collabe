import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationCard } from './registration-card';

describe('RegistrationCard', () => {
  let component: RegistrationCard;
  let fixture: ComponentFixture<RegistrationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
