import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppInfoComponent } from '../app-info/app-info.component';
import { AppUiModule } from '../app-ui.module';
import { AppInfoDialogComponent } from './app-info-dialog.component';


describe('AppInfoDialogComponent', () => {
  let component: AppInfoDialogComponent;
  let fixture: ComponentFixture<AppInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [AppInfoDialogComponent, AppInfoComponent],
        imports: [AppUiModule],
        providers: [
          { provide: MAT_DIALOG_DATA, useValue: {} },
          { provide: MatDialogRef, useValue: {} }
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
