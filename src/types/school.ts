export interface School {
  _id: string;
  title: string;
  slug?: { current: string };
  description?: string;
  icon?: string;
  bannerBackgroundImage?: { asset: { url: string } };
  ogImage?: { asset: { url: string } };
  ogTitle?: string;
  ogDescription?: string;
}
