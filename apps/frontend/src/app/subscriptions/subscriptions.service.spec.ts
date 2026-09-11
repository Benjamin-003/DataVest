import { TestBed, inject } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SubscriptionsService } from './subscriptions.service';

describe('Service: Subscriptions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubscriptionsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
  });

  it('should ...', inject([SubscriptionsService], (service: SubscriptionsService) => {
    expect(service).toBeTruthy();
  }));
});