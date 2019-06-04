import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatsDialogComponent } from './formats-dialog.component';

describe('FormatsDialogComponent', () => {
  let component: FormatsDialogComponent;
  let fixture: ComponentFixture<FormatsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatsDialogComponent ]
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
