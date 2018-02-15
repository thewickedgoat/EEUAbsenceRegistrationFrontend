import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceOverviewComponent } from './absence-overview.component';

describe('AbsenceOverviewComponent', () => {
  let component: AbsenceOverviewComponent;
  let fixture: ComponentFixture<AbsenceOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsenceOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
