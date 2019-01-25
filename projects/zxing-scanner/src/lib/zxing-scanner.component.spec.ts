import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZxingScannerComponent } from './zxing-scanner.component';

describe('ZxingScannerComponent', () => {
  let component: ZxingScannerComponent;
  let fixture: ComponentFixture<ZxingScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZxingScannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZxingScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
