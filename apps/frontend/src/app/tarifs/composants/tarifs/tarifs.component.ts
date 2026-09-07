import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'src/app/subscriptions/subscription.model';
import { SubscriptionsService } from 'src/app/subscriptions/subscriptions.service';

@Component({
  selector: 'app-tarifs',
  standalone: true,
  imports: [CardModule, ButtonModule, RippleModule],
  templateUrl: './tarifs.component.html',
})
export class TarifsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly subscriptionsService = inject(SubscriptionsService);

  public subscription!: Subscription[];

  ngOnInit() {
    this.subscriptionsService.getSubscriptions().subscribe(result => {
      this.subscription = result;
    });
  }

  selectOption(option: string) {
    this.router.navigate([`../authentication/inscription/${option}`]);
  }
}