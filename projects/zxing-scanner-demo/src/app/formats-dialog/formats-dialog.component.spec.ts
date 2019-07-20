import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppUiModule } from '../app-ui.module';
import { FormatsDialogComponent } from './formats-dialog.component';


describe('FormatsDialogComponent', () => {
  let component: FormatsDialogComponent;
  let fixture: ComponentFixture<FormatsDialogComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [FormatsDialogComponent],
        imports: [AppUiModule],
        providers: [
          { provide: MAT_DIALOG_DATA, useValue: {} },
          { provide: MatDialogRef, useValue: {} }
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
