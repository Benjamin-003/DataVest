import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'src/app/subscriptions/subscription.model';
import { SubscriptionsService } from 'src/app/subscriptions/subscriptions.service';
@Component({
  selector: 'app-tarifs',
  templateUrl: './tarifs.component.html'
})
export class TarifsComponent implements OnInit {

  public subscription!: Subscription[];

  constructor(private readonly router: Router,
    private readonly subscriptionsService: SubscriptionsService) { }

  ngOnInit() {
    this.subscriptionsService.getSubscriptions().subscribe(resultOptions => {
      this.subscription = resultOptions;
    })
  }

  selectOption(option: string) {
    this.router.navigate([`../authentication/inscription/${option}`])
  }
}
