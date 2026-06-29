module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getClient",
    ()=>getClient,
    "pool",
    ()=>pool,
    "query",
    ()=>query
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["Pool"]({
    host: process.env.DB_HOST || 'castleskeepprod-ro-1p.gslb4.comcast.com',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'castleskeep',
    user: process.env.DB_USER || 'sryali755',
    password: process.env.DB_PASSWORD || 'CqTFbRlB',
    ssl: false
});
pool.on('error', (err)=>{
    console.error('Unexpected error on idle client', err);
});
async function query(text, params) {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', {
            text,
            duration,
            rows: result.rowCount
        });
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}
async function getClient() {
    return pool.connect();
}
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/offerProcessor.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OfferProcessor",
    ()=>OfferProcessor
]);
class OfferProcessor {
    static processOffers(records) {
        const offerMap = new Map();
        records.forEach((record)=>{
            if (!record.offer_id) return;
            const offerId = record.offer_id;
            if (!offerMap.has(offerId)) {
                offerMap.set(offerId, this.createOffer(record));
            } else {
                const offer = offerMap.get(offerId);
                offer.records.push(record);
            }
        });
        return Array.from(offerMap.values());
    }
    static createOffer(record) {
        const isStrategic = this.isStrategicOffer(record);
        const geographicScope = this.determineGeographicScope([
            record
        ]);
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
            records: [
                record
            ],
            price_value: record.price_step_1_value,
            price_duration: record.price_step1_duration
        };
    }
    static isStrategicOffer(record) {
        const eligibility = record.u_other_eligibility || '';
        return eligibility.includes('CUSTOM_FIELD03_HSE') && eligibility.charAt(0) === '1';
    }
    static extractSalesChannels(channels) {
        return channels.split('|').map((c)=>c.trim()).filter((c)=>c);
    }
    static determineGeographicScope(records) {
        const divisions = new Set(records.map((r)=>r.dv_region).filter(Boolean));
        return divisions.size === 3 ? 'National' : 'Regional';
    }
    static generatePositiveTestCases(offers) {
        const testCases = [];
        let testId = 1;
        offers.forEach((offer)=>{
            const count = offer.is_national ? offer.is_strategic ? 3 : 2 : 2;
            for(let i = 0; i < count; i++){
                const testCase = this.createPositiveTestCase(offer, i, testId);
                testCases.push(testCase);
                testId++;
            }
        });
        return testCases;
    }
    static createPositiveTestCase(offer, index, testId) {
        const divisions = [
            'CENTRAL DIVISION (11592)',
            'NORTHEAST DIVISION (11599)',
            'WEST DIVISION (8617)'
        ];
        const channels = [
            'Online',
            'Retail',
            'Telesales'
        ];
        const statuses = [
            'New Customer',
            'Existing Customer',
            'Mover - Shopping New'
        ];
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
            validation_points: 'Customer has required LO115 tag | Qualifies per status | Sales channel supported'
        };
    }
    static generateNegativeTestCases(offers) {
        const testCases = [];
        let testId = 1;
        offers.forEach((offer)=>{
            const count = offer.is_national ? offer.is_strategic ? 3 : 2 : 3;
            for(let i = 0; i < count; i++){
                const testCase = this.createNegativeTestCase(offer, i, testId);
                testCases.push(testCase);
                testId++;
            }
        });
        return testCases;
    }
    static createNegativeTestCase(offer, index, testId) {
        const scenarios = [
            {
                description: `New customer WITHOUT LO115 tag attempting ${offer.offer_name}`,
                customer_status: 'New Customer',
                customer_tags: 'No LO115 tag',
                division: 'CENTRAL DIVISION (11592)',
                failure_reason: 'Missing required LO115 tag'
            },
            {
                description: `Existing customer with INCORRECT LO115 tag attempting ${offer.offer_name}`,
                customer_status: 'Existing Customer',
                customer_tags: 'LO115 position 3 = Y (Should be N)',
                division: 'NORTHEAST DIVISION (11599)',
                failure_reason: 'LO115 tag has incorrect value'
            },
            {
                description: `Customer in unsupported division attempting ${offer.offer_name}`,
                customer_status: 'New Customer',
                customer_tags: 'LO115 position 3 = N',
                division: 'SOUTHERN DIVISION (99999)',
                failure_reason: 'Unsupported division'
            }
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
            validation_points: 'Eligibility rule validation failure'
        };
    }
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/constants [external] (constants, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("constants", () => require("constants"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[project]/src/lib/excelGenerator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExcelGenerator",
    ()=>ExcelGenerator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$exceljs$2f$excel$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/exceljs/excel.js [app-route] (ecmascript)");
;
class ExcelGenerator {
    static generateWorkbook(offers, positiveTests, negativeTests, summary) {
        const workbook = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$exceljs$2f$excel$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].Workbook();
        const worksheet = workbook.addWorksheet('All Tests');
        // Combine all tests
        const allTests = [
            ...positiveTests,
            ...negativeTests
        ];
        // Create header row
        const headers = [
            'Test ID',
            'Test Type',
            'Offer ID',
            'Offer Name',
            'Description',
            'Customer Status',
            'Customer Type',
            'Customer Tags',
            'Sales Channel',
            'Division',
            'Tenure Days',
            'Existing Services',
            'Speed Tier',
            'Expected Result'
        ];
        // Add header row with styling
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell)=>{
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'FF1F4E78'
                }
            };
            cell.font = {
                bold: true,
                color: {
                    argb: 'FFFFFFFF'
                }
            };
            cell.alignment = {
                horizontal: 'center',
                vertical: 'center',
                wrapText: true
            };
        });
        // Add data rows with color coding
        allTests.forEach((test)=>{
            const row = worksheet.addRow([
                test.test_id,
                test.test_type,
                test.offer_id,
                test.offer_name,
                test.description || '',
                test.customer_status || '',
                test.customer_type || '',
                test.customer_tags || '',
                test.sales_channel || '',
                test.division || '',
                test.tenure_days || '',
                test.existing_services || '',
                test.speed_tier || '',
                test.expected_result || ''
            ]);
            const bgColor = test.test_type === 'Positive' ? 'FFC6EFCE' // Green for positive
             : 'FFFFC7CE'; // Pink/Red for negative
            row.eachCell((cell)=>{
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: bgColor
                    }
                };
                cell.alignment = {
                    horizontal: 'left',
                    vertical: 'center',
                    wrapText: true
                };
            });
        });
        // Set column widths
        const colWidths = [
            12,
            12,
            15,
            25,
            30,
            18,
            15,
            18,
            18,
            20,
            15,
            18,
            12,
            18
        ];
        worksheet.columns = colWidths.map((w)=>({
                width: w
            }));
        // Freeze header row
        worksheet.views = [
            {
                state: 'frozen',
                ySplit: 1
            }
        ];
        // Return buffer synchronously
        const buffer = workbook.xlsx.writeBuffer();
        if (buffer instanceof Promise) {
            return Buffer.from([]);
        }
        return buffer;
    }
    static async generateWorkbookAsync(offers, positiveTests, negativeTests, summary) {
        const workbook = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$exceljs$2f$excel$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].Workbook();
        const worksheet = workbook.addWorksheet('All Tests');
        // Combine all tests
        const allTests = [
            ...positiveTests,
            ...negativeTests
        ];
        // Create header row
        const headers = [
            'Test ID',
            'Test Type',
            'Offer ID',
            'Offer Name',
            'Description',
            'Customer Status',
            'Customer Type',
            'Customer Tags',
            'Sales Channel',
            'Division',
            'Tenure Days',
            'Existing Services',
            'Speed Tier',
            'Expected Result'
        ];
        // Add header row with styling
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell)=>{
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'FF1F4E78'
                }
            };
            cell.font = {
                bold: true,
                color: {
                    argb: 'FFFFFFFF'
                }
            };
            cell.alignment = {
                horizontal: 'center',
                vertical: 'center',
                wrapText: true
            };
        });
        // Add data rows with color coding
        allTests.forEach((test)=>{
            const row = worksheet.addRow([
                test.test_id,
                test.test_type,
                test.offer_id,
                test.offer_name,
                test.description || '',
                test.customer_status || '',
                test.customer_type || '',
                test.customer_tags || '',
                test.sales_channel || '',
                test.division || '',
                test.tenure_days || '',
                test.existing_services || '',
                test.speed_tier || '',
                test.expected_result || ''
            ]);
            const bgColor = test.test_type === 'Positive' ? 'FFC6EFCE' // Green for positive
             : 'FFFFC7CE'; // Pink/Red for negative
            row.eachCell((cell)=>{
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: bgColor
                    }
                };
                cell.alignment = {
                    horizontal: 'left',
                    vertical: 'center',
                    wrapText: true
                };
            });
        });
        // Set column widths
        const colWidths = [
            12,
            12,
            15,
            25,
            30,
            18,
            15,
            18,
            18,
            20,
            15,
            18,
            12,
            18
        ];
        worksheet.columns = colWidths.map((w)=>({
                width: w
            }));
        // Freeze header row
        worksheet.views = [
            {
                state: 'frozen',
                ySplit: 1
            }
        ];
        // Return buffer
        return await workbook.xlsx.writeBuffer();
    }
    static formatTestData(tests) {
        const data = [
            [
                'Test ID',
                'Test Type',
                'Offer ID',
                'Offer Name',
                'Description',
                'Customer Status',
                'Customer Type',
                'Customer Tags',
                'Sales Channel',
                'Division',
                'Tenure Days',
                'Existing Services',
                'Speed Tier',
                'Expected Result'
            ]
        ];
        tests.forEach((test)=>{
            data.push([
                test.test_id,
                test.test_type,
                test.offer_id,
                test.offer_name,
                test.description || '',
                test.customer_status || '',
                test.customer_type || '',
                test.customer_tags || '',
                test.sales_channel || '',
                test.division || '',
                test.tenure_days || '',
                test.existing_services || '',
                test.speed_tier || '',
                test.expected_result || ''
            ]);
        });
        return data;
    }
    static formatTestDataWithColors(tests) {
        return this.formatTestData(tests);
    }
}
}),
"[project]/src/app/api/orchestrate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offerProcessor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/offerProcessor.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$excelGenerator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/excelGenerator.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const WRITER_API_KEY = 'wr-RhgO5xw1fPqGpq3-inAWTQ';
const WRITER_API_URL = 'https://api.writer.com/v1';
async function generateInsightsWithWriter(atlasRequest) {
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'palmyra-x-004',
                prompt: prompt,
                max_tokens: 500,
                temperature: 0.7
            })
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
async function POST(request) {
    try {
        const body = await request.json();
        const { requestNumber } = body;
        if (!requestNumber) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Request number is required'
            }, {
                status: 400
            });
        }
        // Connect to database
        console.log(`🔗 Connecting to Database for ${requestNumber}...`);
        const atlasResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT * FROM public.x_mcim_atlas2_atlas_request WHERE number = $1`, [
            requestNumber
        ]);
        if (atlasResult.rows.length === 0) {
            console.error(`❌ Database Error: No atlas request found for ${requestNumber}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `No atlas request found for ${requestNumber}`
            }, {
                status: 404
            });
        }
        console.log('✅ Connected to Database');
        const atlasRequest = atlasResult.rows[0];
        // Generate AI insights using Writer
        const aiInsights = await generateInsightsWithWriter(atlasRequest);
        // Create offer structure from atlas request
        const offers = [
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
                dv_region: atlasRequest.api_division
            }
        ];
        // Process offers
        const processedOffers = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offerProcessor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OfferProcessor"].processOffers(offers);
        const positiveTests = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offerProcessor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OfferProcessor"].generatePositiveTestCases(processedOffers);
        const negativeTests = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offerProcessor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OfferProcessor"].generateNegativeTestCases(processedOffers);
        // Generate Excel with Writer insights
        const summary = {
            request_number: requestNumber,
            request_name: atlasRequest.request_name,
            business_strategy: atlasRequest.business_strategy,
            geographic_scope: atlasRequest.api_division || 'National',
            total_offers: processedOffers.length,
            standard_offers: processedOffers.filter((o)=>!o.is_strategic).length,
            strategic_offers: processedOffers.filter((o)=>o.is_strategic).length,
            total_positive_tests: positiveTests.length,
            total_negative_tests: negativeTests.length,
            total_tests: positiveTests.length + negativeTests.length,
            ai_insights: aiInsights
        };
        const excelBuffer = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$excelGenerator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ExcelGenerator"].generateWorkbookAsync(processedOffers, positiveTests, negativeTests, summary);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](excelBuffer, {
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename="Atlas_Test_Plan_${requestNumber}_${Date.now()}.xlsx"`,
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });
    } catch (error) {
        console.error('Orchestration error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0bd7f27._.js.map