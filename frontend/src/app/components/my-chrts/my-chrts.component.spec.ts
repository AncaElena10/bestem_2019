import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyChrtsComponent } from './my-chrts.component';

describe('MyChrtsComponent', () => {
  let component: MyChrtsComponent;
  let fixture: ComponentFixture<MyChrtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyChrtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyChrtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
