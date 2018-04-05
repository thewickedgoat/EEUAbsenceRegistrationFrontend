import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayyearListComponent } from './holidayyear-list.component';

describe('HolidayyearListComponent', () => {
  let component: HolidayyearListComponent;
  let fixture: ComponentFixture<HolidayyearListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayyearListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayyearListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
