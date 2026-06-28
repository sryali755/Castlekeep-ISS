import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { OfferProcessor } from '@/lib/offerProcessor';
import { ExcelGenerator } from '@/lib/excelGenerator';

const WRITER_API_KEY = 'wr-RhgO5xw1fPqGpq3-inAWTQ';
const WRITER_API_URL = 'https://api.writer.com/v1';

async function generateInsightsWithWriter(atlasRequest: any): Promise<string> {
  try {
    console.log('📝 Connecting to Writer API...');

    const prompt = `You are an expert QA test plan generator for Comcast atlas retention offers.

Analyze this atlas request and provide concise, actionable test insights:

Request Number: ${atlasRequest.number}
Request Name: ${atlasRequest.request_name}
Business Strategy: ${atlasRequest.business_strategy}
Division: ${atlasRequest.api_division || 'National'}
Status: ${atlasRequest.state}
Launch Date: ${atlasRequest.is_confirmed_launch_date}

Provide:
1. Key test scenarios (2-3 bullets)
2. Critical eligibility criteria to validate
3. Recommended test coverage areas

Keep response concise and technical.`;

    const response = await fetch(`${WRITER_API_URL}/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WRITER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'palmyra-x-004',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error(`❌ Writer API Error: ${response.status} ${response.statusText}`);
      throw new Error(`Writer API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Connected to Writer API');
    return data.completion || data.text || 'AI insights generated successfully.';
  } catch (error) {
    console.error('❌ Writer API Connection Failed:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestNumber } = body;

    if (!requestNumber) {
      return NextResponse.json({ error: 'Request number is required' }, { status: 400 });
    }

    // Connect to database
    console.log(`🔗 Connecting to Database for ${requestNumber}...`);
    const atlasResult = await query(
      `SELECT * FROM public.x_mcim_atlas2_atlas_request WHERE number = $1`,
      [requestNumber]
    );

    if (atlasResult.rows.length === 0) {
      console.error(`❌ Database Error: No atlas request found for ${requestNumber}`);
      return NextResponse.json(
        { error: `No atlas request found for ${requestNumber}` },
        { status: 404 }
      );
    }

    console.log('✅ Connected to Database');
    const atlasRequest = atlasResult.rows[0];

    // Generate AI insights using Writer
    const aiInsights = await generateInsightsWithWriter(atlasRequest);

    // Create offer structure from atlas request
    const offers: any[] = [
      {
        number: atlasRequest.number,
        offer_id: atlasRequest.number,
        offer_name: atlasRequest.request_name,
        offer_start_date: atlasRequest.is_confirmed_launch_date,
        offer_end_date: null,
        u_other_eligibility: 'ATLAS_REQUEST',
        dv_sales_channel: 'ATLAS',
        price_step_1_value: null,
        dv_customer_eligibility: atlasRequest.customer_type,
        dv_region: atlasRequest.api_division,
      },
    ];

    // Process offers
    const processedOffers = OfferProcessor.processOffers(offers);
    const positiveTests = OfferProcessor.generatePositiveTestCases(processedOffers);
    const negativeTests = OfferProcessor.generateNegativeTestCases(processedOffers);

    // Generate Excel with Writer insights
    const summary = {
      request_number: requestNumber,
      request_name: atlasRequest.request_name,
      business_strategy: atlasRequest.business_strategy,
      geographic_scope: atlasRequest.api_division || 'National',
      total_offers: processedOffers.length,
      standard_offers: processedOffers.filter((o) => !o.is_strategic).length,
      strategic_offers: processedOffers.filter((o) => o.is_strategic).length,
      total_positive_tests: positiveTests.length,
      total_negative_tests: negativeTests.length,
      total_tests: positiveTests.length + negativeTests.length,
      ai_insights: aiInsights,
    };

    const excelBuffer = await ExcelGenerator.generateWorkbookAsync(
      processedOffers,
      positiveTests,
      negativeTests,
      summary
    );

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="Atlas_Test_Plan_${requestNumber}_${Date.now()}.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Orchestration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
