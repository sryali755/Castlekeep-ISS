import { OfferRecord, Offer, TestCase } from './types';

export class OfferProcessor {
  static processOffers(records: OfferRecord[]): Offer[] {
    const offerMap = new Map<string, Offer>();

    records.forEach((record) => {
      if (!record.offer_id) return;

      const offerId = record.offer_id;
      if (!offerMap.has(offerId)) {
        offerMap.set(offerId, this.createOffer(record));
      } else {
        const offer = offerMap.get(offerId)!;
        offer.records.push(record);
      }
    });

    return Array.from(offerMap.values());
  }

  private static createOffer(record: OfferRecord): Offer {
    const isStrategic = this.isStrategicOffer(record);
    const geographicScope = this.determineGeographicScope([record]);

    return {
      offer_id: record.offer_id || '',
      offer_name: record.offer_name || `Offer ${record.offer_id}`,
      start_date: record.offer_start_date,
      end_date: record.offer_end_date,
      geographic_scope: geographicScope,
      customer_eligibility: record.dv_customer_eligibility || 'Not specified',
      sales_channels: this.extractSalesChannels(record.dv_sales_channel || ''),
      is_strategic: isStrategic,
      is_national: geographicScope === 'National',
      records: [record],
      price_value: record.price_step_1_value,
      price_duration: record.price_step1_duration,
    };
  }

  static isStrategicOffer(record: OfferRecord): boolean {
    const eligibility = record.u_other_eligibility || '';
    return eligibility.includes('CUSTOM_FIELD03_HSE') && eligibility.charAt(0) === '1';
  }

  private static extractSalesChannels(channels: string): string[] {
    return channels.split('|').map((c) => c.trim()).filter((c) => c);
  }

  private static determineGeographicScope(records: OfferRecord[]): string {
    const divisions = new Set(records.map((r) => r.dv_region).filter(Boolean));
    return divisions.size === 3 ? 'National' : 'Regional';
  }

  static generatePositiveTestCases(offers: Offer[]): TestCase[] {
    const testCases: TestCase[] = [];
    let testId = 1;

    offers.forEach((offer) => {
      const count = offer.is_national ? (offer.is_strategic ? 3 : 2) : 2;

      for (let i = 0; i < count; i++) {
        const testCase = this.createPositiveTestCase(offer, i, testId);
        testCases.push(testCase);
        testId++;
      }
    });

    return testCases;
  }

  private static createPositiveTestCase(offer: Offer, index: number, testId: number): TestCase {
    const divisions = ['CENTRAL DIVISION (11592)', 'NORTHEAST DIVISION (11599)', 'WEST DIVISION (8617)'];
    const channels = ['Online', 'Retail', 'Telesales'];
    const statuses = ['New Customer', 'Existing Customer', 'Mover - Shopping New'];

    const divIndex = index % divisions.length;
    const channelIndex = index % channels.length;

    return {
      test_id: `POS-${String(testId).padStart(3, '0')}`,
      test_type: 'Positive',
      offer_id: offer.offer_id,
      offer_name: offer.offer_name,
      description: `${statuses[index % statuses.length]} with LO115 tag ordering ${offer.offer_name}`,
      customer_status: statuses[index % statuses.length],
      customer_type: 'Residential',
      customer_tags: 'LO115 position 3 = N',
      sales_channel: channels[channelIndex],
      division: divisions[divIndex],
      tenure_days: index === 1 ? '30 days' : '0 (New)',
      existing_services: index === 1 ? 'Video, Voice' : 'None',
      speed_tier: offer.price_value ? `$${offer.price_value}` : 'N/A',
      expected_result: 'Offer Appears',
      validation_points: 'Customer has required LO115 tag | Qualifies per status | Sales channel supported',
    };
  }

  static generateNegativeTestCases(offers: Offer[]): TestCase[] {
    const testCases: TestCase[] = [];
    let testId = 1;

    offers.forEach((offer) => {
      const count = offer.is_national ? (offer.is_strategic ? 3 : 2) : 3;

      for (let i = 0; i < count; i++) {
        const testCase = this.createNegativeTestCase(offer, i, testId);
        testCases.push(testCase);
        testId++;
      }
    });

    return testCases;
  }

  private static createNegativeTestCase(offer: Offer, index: number, testId: number): TestCase {
    const scenarios = [
      {
        description: `New customer WITHOUT LO115 tag attempting ${offer.offer_name}`,
        customer_status: 'New Customer',
        customer_tags: 'No LO115 tag',
        division: 'CENTRAL DIVISION (11592)',
        failure_reason: 'Missing required LO115 tag',
      },
      {
        description: `Existing customer with INCORRECT LO115 tag attempting ${offer.offer_name}`,
        customer_status: 'Existing Customer',
        customer_tags: 'LO115 position 3 = Y (Should be N)',
        division: 'NORTHEAST DIVISION (11599)',
        failure_reason: 'LO115 tag has incorrect value',
      },
      {
        description: `Customer in unsupported division attempting ${offer.offer_name}`,
        customer_status: 'New Customer',
        customer_tags: 'LO115 position 3 = N',
        division: 'SOUTHERN DIVISION (99999)',
        failure_reason: 'Unsupported division',
      },
    ];

    const scenario = scenarios[index % scenarios.length];

    return {
      test_id: `NEG-${String(testId).padStart(3, '0')}`,
      test_type: 'Negative',
      offer_id: offer.offer_id,
      offer_name: offer.offer_name,
      description: scenario.description,
      customer_status: scenario.customer_status,
      customer_type: 'Residential',
      customer_tags: scenario.customer_tags,
      sales_channel: 'Online',
      division: scenario.division,
      tenure_days: '0 (New)',
      existing_services: 'None',
      speed_tier: offer.price_value ? `$${offer.price_value}` : 'N/A',
      expected_result: 'Offer Does NOT Appear',
      failure_reason: scenario.failure_reason,
      validation_points: 'Eligibility rule validation failure',
    };
  }
}
