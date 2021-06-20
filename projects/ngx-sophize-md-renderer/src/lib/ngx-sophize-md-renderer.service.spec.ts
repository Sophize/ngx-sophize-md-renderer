import { TestBed } from '@angular/core/testing';

import { NgxSophizeMdRendererService } from './ngx-sophize-md-renderer.service';

describe('NgxSophizeMdRendererService', () => {
  let service: NgxSophizeMdRendererService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSophizeMdRendererService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
