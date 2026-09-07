import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Article } from '../../interfaces/article';

@Component({
  selector: 'app-article-table',
  standalone: true,
  imports: [CommonModule, TableModule, TooltipModule],
  templateUrl: './article-table.component.html',
})
export class ArticleTableComponent {
  @Input() articleListe!: Article[];
  public titleLength = 50;
}
 
