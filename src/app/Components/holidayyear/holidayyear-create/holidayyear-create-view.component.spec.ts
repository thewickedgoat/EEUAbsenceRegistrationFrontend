import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayyearCreateViewComponent } from './holidayyear-create-view.component';

describe('HolidayyearCreateViewComponent', () => {
  let component: HolidayyearCreateViewComponent;
  let fixture: ComponentFixture<HolidayyearCreateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayyearCreateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayyearCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
