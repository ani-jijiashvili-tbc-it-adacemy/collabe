import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRegistrationsPage } from './my-registrations-page';

describe('MyRegistrationsPage', () => {
  let component: MyRegistrationsPage;
  let fixture: ComponentFixture<MyRegistrationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRegistrationsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRegistrationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
