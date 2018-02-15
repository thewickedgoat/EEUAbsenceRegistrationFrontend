import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceConfirmationComponent } from './absence-confirmation.component';

describe('AbsenceConfirmationComponent', () => {
  let component: AbsenceConfirmationComponent;
  let fixture: ComponentFixture<AbsenceConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsenceConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
