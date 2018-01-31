import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxZxingComponent } from './ngx-zxing.component';

describe('NgxZxingComponent', () => {
    let component: NgxZxingComponent;
    let fixture: ComponentFixture<NgxZxingComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule({
                declarations: [NgxZxingComponent]
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NgxZxingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
