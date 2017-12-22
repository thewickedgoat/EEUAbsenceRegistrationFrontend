import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceOverviewControllerComponent } from './absence-overview-controller.component';

describe('AbsenceOverviewControllerComponent', () => {
  let component: AbsenceOverviewControllerComponent;
  let fixture: ComponentFixture<AbsenceOverviewControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsenceOverviewControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceOverviewControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
