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
  public items = [
    {
      label: 'FT - Economic News', command: () => {
        this.FTStream()
      }
    },
    {
      label: 'WSJ - US', command: () => {
        this.WSJStream()
      }
    }]
  public activeItem = this.items[0];

  constructor(private macroEconomicNews: MacroeconomicNewsService) { }

  ngOnInit(): void {
    this.FTStream()
  }

  //Permet de remplir de tableau d'itération avec les données récupéré
  bindDatasToArray(articleListe: Article[]) {
    this.firstArticle = articleListe[0]
    this.articleListe.shift()
  }

  FTStream() {
    this.macroEconomicNews.getNews('https://www.ft.com/rss/home').subscribe(result => {
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
      this.bindDatasToArray(this.articleListe)
    })
  }

  //Appel le flux du Wall Street Journal
  WSJStream() {
    this.macroEconomicNews.getNews('https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml').subscribe(result => {
      this.articleListe = result.rss.channel.item.map(
        (rawData: any) => {
          let description: { _cdata: string } | undefined = rawData?.description;
          if (description === undefined)
            description = { _cdata: '' };
          return {
            title: rawData.title['_text'],
            description: description['_cdata'],
            publicationDate: rawData.pubDate['_text'],
            link: rawData.link['_text']
          }
        })
      this.sortArticleByDate(this.articleListe)
      this.bindDatasToArray(this.articleListe)
    })
  }

  //Permet de trier les articles par ordre décroissant
  sortArticleByDate(list: Article[] | undefined) {
    return list?.sort(function (a, b): any {
      return Date.parse(b.publicationDate) - Date.parse(a.publicationDate);
    });
  }
}
