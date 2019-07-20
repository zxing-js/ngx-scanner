import { async, TestBed } from '@angular/core/testing';
import { AppUiModule } from './app-ui.module';
import { AppComponent } from './app.component';


describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [AppUiModule],
        declarations: [AppComponent],
      })
      .compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render zxing-scanner tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('zxing-scanner')).toBeTruthy();
  }));
});
