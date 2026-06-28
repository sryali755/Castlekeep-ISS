module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
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
"[project]/src/lib/excelGenerator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExcelGenerator",
    ()=>ExcelGenerator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-route] (ecmascript)");
;
class ExcelGenerator {
    static generateWorkbook(offers, positiveTests, negativeTests, summary) {
        const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].book_new();
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
        // Create data rows
        const data = [
            headers
        ];
        allTests.forEach((test)=>{
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
        // Create sheet
        const sheet = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].aoa_to_sheet(data);
        // Apply styling
        const range = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].decode_range(sheet['!ref'] || 'A1');
        for(let R = range.s.r; R <= range.e.r; ++R){
            for(let C = range.s.c; C <= range.e.c; ++C){
                const cellAddress = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].encode_col(C) + (R + 1);
                if (!sheet[cellAddress]) continue;
                const cell = sheet[cellAddress];
                if (R === 0) {
                    // Header row - dark blue background, white text, bold
                    cell.fill = {
                        patternType: 'solid',
                        fgColor: {
                            rgb: 'FF1F4E78'
                        }
                    };
                    cell.font = {
                        bold: true,
                        color: {
                            rgb: 'FFFFFFFF'
                        }
                    };
                } else {
                    // Get test type from column B (index 1)
                    const testTypeCell = sheet[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].encode_col(1) + (R + 1)];
                    const testType = testTypeCell?.v;
                    if (testType === 'Positive') {
                        // Green background for positive tests
                        cell.fill = {
                            patternType: 'solid',
                            fgColor: {
                                rgb: 'FFE2EFD9'
                            }
                        };
                    } else if (testType === 'Negative') {
                        // Red background for negative tests
                        cell.fill = {
                            patternType: 'solid',
                            fgColor: {
                                rgb: 'FFFCE4D6'
                            }
                        };
                    }
                }
            }
        }
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
        sheet['!cols'] = colWidths.map((w)=>({
                wch: w
            }));
        // Freeze header row
        sheet['!freeze'] = {
            xSplit: 0,
            ySplit: 1
        };
        // Add sheet to workbook
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(workbook, sheet, 'All Tests');
        // Write and return buffer
        const wbout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["write"])(workbook, {
            bookType: 'xlsx',
            type: 'buffer'
        });
        return wbout;
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

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offerProcessor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/offerProcessor.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$excelGenerator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/excelGenerator.ts [app-route] (ecmascript)");
;
;
;
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
        // Generate sample offers based on ISS number
        const hash = requestNumber.split('').reduce((h, c)=>h + c.charCodeAt(0), 0);
        const seed = hash % 10;
        const numOffers = 3 + seed % 4;
        const offers = [];
        const pricePoints = [
            29.99,
            39.99,
            49.99,
            59.99,
            69.99
        ];
        const divisions = [
            'CENTRAL',
            'NORTHEAST',
            'WEST'
        ];
        for(let i = 0; i < numOffers; i++){
            const priceIndex = (seed + i * 2) % pricePoints.length;
            const divIndex = (seed + i) % divisions.length;
            offers.push({
                number: requestNumber,
                offer_id: `OFR-${requestNumber}-${i + 1}`,
                offer_name: `$${pricePoints[priceIndex]} Offer ${i + 1}`,
                offer_start_date: '2024-01-01',
                offer_end_date: '2024-12-31',
                u_other_eligibility: '0|LO115|N',
                dv_sales_channel: 'RETENTION_TELESALES|CALL_CENTER_POS',
                price_step_1_value: pricePoints[priceIndex],
                dv_customer_eligibility: 'Residential',
                dv_region: divisions[divIndex]
            });
        }
        // Process offers
        const processedOffers = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offerProcessor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OfferProcessor"].processOffers(offers);
        const positiveTests = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offerProcessor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OfferProcessor"].generatePositiveTestCases(processedOffers);
        const negativeTests = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offerProcessor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OfferProcessor"].generateNegativeTestCases(processedOffers);
        // Generate Excel
        const summary = {
            request_number: requestNumber,
            request_name: 'Test Plan',
            business_strategy: 'RETENTION',
            geographic_scope: 'National',
            total_offers: processedOffers.length,
            standard_offers: processedOffers.filter((o)=>!o.is_strategic).length,
            strategic_offers: processedOffers.filter((o)=>o.is_strategic).length,
            total_positive_tests: positiveTests.length,
            total_negative_tests: negativeTests.length,
            total_tests: positiveTests.length + negativeTests.length
        };
        const excelBuffer = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$excelGenerator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ExcelGenerator"].generateWorkbook(processedOffers, positiveTests, negativeTests, summary);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](new Uint8Array(excelBuffer), {
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
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0kmiwto._.js.map