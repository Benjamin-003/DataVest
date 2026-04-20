import { Article } from './../../interfaces/article';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-last-article-card',
    templateUrl: './last-article-card.component.html',
    standalone: false
})
export class LastArticleCardComponent {
@Input() firstArticle! :Article

}
