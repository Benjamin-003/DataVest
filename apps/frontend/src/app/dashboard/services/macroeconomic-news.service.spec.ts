/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { MacroeconomicNewsService } from './macroeconomic-news.service';

describe('Service: MacroeconomicNews', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MacroeconomicNewsService]
    });
  });

  it('should ...', inject([MacroeconomicNewsService], (service: MacroeconomicNewsService) => {
    expect(service).toBeTruthy();
  }));
});
