import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceConfirmationViewComponent } from './absence-confirmation-view.component';

describe('AbsenceConfirmationViewComponent', () => {
  let component: AbsenceConfirmationViewComponent;
  let fixture: ComponentFixture<AbsenceConfirmationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsenceConfirmationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceConfirmationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
