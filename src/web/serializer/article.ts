import { ArticleInterface } from "../../model/article";

export class ArticleSerializer {
  public static async serializeArticle(article: ArticleInterface) {
    return {
      id: article.id,
      name: article.title,
      subTitle: article.subTitle,
      slug: article.slug,
      content: article.content,
    };
  }

  public static async serializeArticles(articles: ArticleInterface[]) {
    return Promise.all(
      articles.map(async (article) => {
        return await ArticleSerializer.serializeArticle(article);
      })
    );
  }
}
