import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantRow } from './participant-row';

describe('ParticipantRow', () => {
  let component: ParticipantRow;
  let fixture: ComponentFixture<ParticipantRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
