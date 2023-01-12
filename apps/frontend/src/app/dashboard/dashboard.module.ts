import { LastArticleCardComponent } from './pages/last-article-card/last-article-card.component';
import { TableFooterComponent } from './pages/table-footer/table-footer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ArticleTableComponent } from './pages/article-table/article-table.component';
import { TabMenuModule } from 'primeng/tabmenu';
@NgModule({
  declarations: [
    DashboardComponent,
    ArticleTableComponent,
    TableFooterComponent,
    LastArticleCardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TableModule,
    ButtonModule,
    CardModule,
    TooltipModule,
    TabMenuModule
  ]
})
export class DashboardModule { }
