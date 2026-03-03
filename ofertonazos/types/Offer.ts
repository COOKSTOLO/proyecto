export interface Offer {
  id?: string;
  title: string;
  price: number;
  imageUrl: string;
  description?: string;
  affiliateLink: string;
  userId: string;
  userName: string;
  likesCount: number;
  createdAt: any;
  source: "manual" | "auto";
}