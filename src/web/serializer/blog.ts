import { ArticleInterface } from "../../model/article";

export class BlogSerializer {
  public static async serializeArticle(article: ArticleInterface) {
    return {
      id: article.id,
      title: article.title,
      subTitle: article.subTitle,
      slug: article.slug,
      content: article.content,
      comments: article.comments,
      category: article.category
    };
  }

  public static async serializeArticles(articles: ArticleInterface[]) {
    return Promise.all(
      articles.map(async (article) => {
        return await BlogSerializer.serializeArticle(article);
      })
    );
  }
}
