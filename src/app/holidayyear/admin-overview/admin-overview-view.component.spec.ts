import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOverviewViewComponent } from './admin-overview-view.component';

describe('AdminOverviewViewComponent', () => {
  let component: AdminOverviewViewComponent;
  let fixture: ComponentFixture<AdminOverviewViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOverviewViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOverviewViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
