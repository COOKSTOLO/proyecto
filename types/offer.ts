export interface Offer {
  id: string;
  title: string;
  price: number;
  image_url: string;
  description: string | null;
  affiliate_link: string;
  user_id: string | null;
  likes_count: number;
  source: 'manual' | 'scraper';
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface OfferWithUser extends Offer {
  user?: {
    name: string | null;
    avatar_url: string | null;
  };
}

export interface CreateOfferDto {
  title: string;
  price: number;
  image_url: string;
  description?: string;
  affiliate_link: string;
}
