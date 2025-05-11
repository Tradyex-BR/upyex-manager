export interface Affiliate {
  id: string;
  name: string;
  email: string;
  integration_code: string;
  is_active: boolean;
  created_at: string;
  applications: AffiliateApplication[];
}

export interface AffiliateApplication {
  id: string;
  commission_percentage: number;
  commission_release_days: number;
} 