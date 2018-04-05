import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicholidaysCreateViewComponent } from './publicholidays-create-view.component';

describe('PublicholidaysCreateViewComponent', () => {
  let component: PublicholidaysCreateViewComponent;
  let fixture: ComponentFixture<PublicholidaysCreateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicholidaysCreateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicholidaysCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
