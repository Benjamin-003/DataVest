import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../interfaces/article';
 
@Component({
  selector: 'app-table-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-footer.component.html',
})
export class TableFooterComponent {
  @Input() firstArticle!: Article;
}

