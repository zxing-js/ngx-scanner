import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppUiModule } from '../app-ui.module';
import { AppInfoComponent } from './app-info.component';


describe('AppInfoComponent', () => {
  let component: AppInfoComponent;
  let fixture: ComponentFixture<AppInfoComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [AppInfoComponent],
        imports: [AppUiModule],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
