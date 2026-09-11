import { TestBed, inject } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MacroeconomicNewsService } from './macroeconomic-news.service';

describe('Service: MacroeconomicNews', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MacroeconomicNewsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
  });

  it('should ...', inject([MacroeconomicNewsService], (service: MacroeconomicNewsService) => {
    expect(service).toBeTruthy();
  }));
});