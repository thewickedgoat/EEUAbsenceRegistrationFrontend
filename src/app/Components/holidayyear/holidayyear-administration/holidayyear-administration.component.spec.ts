import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayyearAdministrationComponent } from './holidayyear-administration.component';

describe('HolidayyearAdministrationComponent', () => {
  let component: HolidayyearAdministrationComponent;
  let fixture: ComponentFixture<HolidayyearAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayyearAdministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayyearAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
