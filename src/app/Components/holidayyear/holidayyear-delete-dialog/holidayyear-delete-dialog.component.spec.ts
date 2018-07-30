import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayyearDeleteDialogComponent } from './holidayyear-delete-dialog.component';

describe('HolidayyearDeleteDialogComponent', () => {
  let component: HolidayyearDeleteDialogComponent;
  let fixture: ComponentFixture<HolidayyearDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayyearDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayyearDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
