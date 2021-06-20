import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSophizeMdRendererComponent } from './ngx-sophize-md-renderer.component';

describe('NgxSophizeMdRendererComponent', () => {
  let component: NgxSophizeMdRendererComponent;
  let fixture: ComponentFixture<NgxSophizeMdRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxSophizeMdRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxSophizeMdRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
