import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayyearAdministrationViewComponent } from './holidayyear-administration-view.component';

describe('HolidayyearAdministrationViewComponent', () => {
  let component: HolidayyearAdministrationViewComponent;
  let fixture: ComponentFixture<HolidayyearAdministrationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayyearAdministrationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayyearAdministrationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
