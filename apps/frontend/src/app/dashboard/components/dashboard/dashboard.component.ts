import { Component, OnInit } from '@angular/core';
import { Article } from './../../interfaces/article';
import { MacroeconomicNewsService } from './../../services/macroeconomic-news.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {
  public articleListe!: Article[]
  public firstArticle: Article = { title: "", description: "", publicationDate: "", link: "" }

  constructor(private macroEconomicNews: MacroeconomicNewsService) { }
  ngOnInit(): void {
    this.macroEconomicNews.getFinancialTimesNews().subscribe(result => {
      this.articleListe = result.rss.channel.item.map(
        (rawData: any) => {
          let description: { _cdata: string } | undefined = rawData?.description;
          if (description === undefined)
            description = { _cdata: '' };
          return {
            title: rawData.title['_cdata'],
            description: description['_cdata'],
            publicationDate: rawData.pubDate['_text'],
            link: rawData.link['_text']
          }
        })
      this.sortArticleByDate(this.articleListe)
      this.firstArticle = this.articleListe[0]
      this.articleListe.shift()
    }
    )
  }

  //Permet de trier les articles par ordre décroissant
  sortArticleByDate(list: Article[] | undefined) {
    return list?.sort(function (a, b): any {
      return Date.parse(b.publicationDate) - Date.parse(a.publicationDate);
    });
  }
}
