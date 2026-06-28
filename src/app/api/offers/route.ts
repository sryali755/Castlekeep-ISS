import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '1000';

    const result = await query(
      `SELECT * FROM public.x_mcim_atlas2_atlas_request LIMIT $1`,
      [parseInt(limit)]
    );

    // Transform atlas request data to offer record format
    const transformedData = result.rows.map((row: any) => ({
      // Map to OfferRecord interface
      offer_id: row.number,
      offer_name: row.request_name,
      offer_type: row.service_offering,
      division: row.api_division || row.dv_division,
      dv_region: row.region || row.dv_region,
      price_step_1_value: null, // Not available in atlas requests
      price_step1_duration: null, // Not available in atlas requests
      dv_sales_channel: null,
      dv_customer_eligibility: row.customer_type,
      dv_tier_of_service: row.service_offering,
      u_other_eligibility: null,
      xm_additional_eligibility: row.business_strategy?.includes('XM') ? row.business_strategy : null,
      // Include other relevant fields
      business_strategy: row.business_strategy,
      state: row.state,
      opened_at: row.opened_at,
      closed_at: row.closed_at,
      sys_id: row.sys_id,
    }));

    return NextResponse.json({
      data: transformedData,
      count: result.rowCount,
    });
  } catch (error) {
    console.error('Offers API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}
