import { Component, Input } from '@angular/core';
import { Article } from '../../interfaces/article';

@Component({
    selector: 'app-table-footer',
    templateUrl: './table-footer.component.html',
    standalone: false
})
export class TableFooterComponent {
  @Input() firstArticle!: Article

}
