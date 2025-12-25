import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseEventsPage } from './browse-events-page';

describe('BrowseEventsPage', () => {
  let component: BrowseEventsPage;
  let fixture: ComponentFixture<BrowseEventsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseEventsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
