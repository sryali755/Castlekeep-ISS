export interface OfferRecord {
  number?: string;
  request_name?: string;
  business_strategy?: string;
  division?: string;
  sys_id?: string;
  offer_id?: string;
  offer_name?: string;
  offer_start_date?: string;
  offer_end_date?: string;
  u_other_eligibility?: string;
  dv_sales_channel?: string;
  dv_tier_of_service?: string;
  price_step_1_value?: string | number;
  price_step1_duration?: string;
  dv_price_step1_type?: string;
  dv_customer_eligibility?: string;
  dv_region?: string;
  offer_type?: string;
  additional_promotional_add_ons?: string | null;
  xm_additional_eligibility?: string | null;
}

export interface Offer {
  offer_id: string;
  offer_name: string;
  start_date?: string;
  end_date?: string;
  geographic_scope: string;
  customer_eligibility: string;
  sales_channels: string[];
  is_strategic: boolean;
  is_national: boolean;
  records: OfferRecord[];
  eligibility_rules?: any[];
  xm_rules?: any;
  price_value?: string | number;
  price_duration?: string;
}

export interface TestCase {
  test_id: string;
  test_type: 'Positive' | 'Negative';
  offer_id: string;
  offer_name: string;
  description?: string;
  customer_status?: string;
  customer_type?: string;
  customer_tags?: string;
  sales_channel?: string;
  division?: string;
  tenure_days?: string;
  existing_services?: string;
  speed_tier?: string;
  expected_result?: string;
  validation_points?: string;
  failure_reason?: string;
}

export interface TestPlanSummary {
  request_number: string;
  request_name: string;
  business_strategy: string;
  geographic_scope: string;
  total_offers: number;
  standard_offers: number;
  strategic_offers: number;
  total_positive_tests: number;
  total_negative_tests: number;
  total_tests: number;
}

export interface EligibilityRule {
  rule_id: string;
  rule_type: string;
  conditions: string[];
}

export interface XMRule {
  rule_id: string;
  xm_type: string;
  requirements: string[];
}
