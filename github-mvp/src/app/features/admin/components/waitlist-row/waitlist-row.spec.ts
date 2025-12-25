import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitlistRow } from './waitlist-row';

describe('WaitlistRow', () => {
  let component: WaitlistRow;
  let fixture: ComponentFixture<WaitlistRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitlistRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitlistRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
