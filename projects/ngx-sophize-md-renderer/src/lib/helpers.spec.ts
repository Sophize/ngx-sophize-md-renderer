import { TestBed } from '@angular/core/testing';
import { Helpers } from './helpers';

describe('Helpers', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(Helpers.isNonEmptyList([])).toBeFalse();
  });
});
