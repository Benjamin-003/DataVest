import { Component, Input } from '@angular/core';
import { Article } from '../../interfaces/article';

@Component({
  selector: 'app-article-table',
  templateUrl: './article-table.component.html'
})
export class ArticleTableComponent {
  @Input() articleListe!: Article[]
  public first = 0;
  public rows = 10;
  public titleLength = 50;

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.articleListe ? this.first === (this.articleListe.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.articleListe ? this.first === 0 : true;
  }
}
