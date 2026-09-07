import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Article } from '../../interfaces/article';

@Component({
  selector: 'app-last-article-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './last-article-card.component.html',
})
export class LastArticleCardComponent {
  @Input() firstArticle!: Article;
}