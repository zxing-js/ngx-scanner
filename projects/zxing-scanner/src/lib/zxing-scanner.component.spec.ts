import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZXingScannerComponent } from './zxing-scanner.component';

describe('ZXingScannerComponent', () => {
  let component: ZXingScannerComponent;
  let fixture: ComponentFixture<ZXingScannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZXingScannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZXingScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
