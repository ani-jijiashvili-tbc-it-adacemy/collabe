import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationTabs } from './registration-tabs';

describe('RegistrationTabs', () => {
  let component: RegistrationTabs;
  let fixture: ComponentFixture<RegistrationTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
