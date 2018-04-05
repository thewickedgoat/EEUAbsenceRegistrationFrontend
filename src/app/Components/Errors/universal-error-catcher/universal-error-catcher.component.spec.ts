import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalErrorCatcherComponent } from './universal-error-catcher.component';

describe('UniversalErrorCatcherComponent', () => {
  let component: UniversalErrorCatcherComponent;
  let fixture: ComponentFixture<UniversalErrorCatcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversalErrorCatcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversalErrorCatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
