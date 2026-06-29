module.exports = [
"[project]/src/lib/offerProcessor.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/components/NaturalLanguageQueryEngine.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NaturalLanguageQueryEngine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'lucide-react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offerProcessor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/offerProcessor.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const EXAMPLE_QUERIES = [
    'How many offers are strategic?',
    'Show offers with XM eligibility',
    'Which offers are available in WEST?',
    'What are the prices and durations?',
    'List national offers'
];
const getUniqueOffers = (records)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offerProcessor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OfferProcessor"].processOffers(records);
const includes = (value, needle)=>String(value ?? '').toLowerCase().includes(needle.toLowerCase());
function uniqueByOfferId(records) {
    return Array.from(new Map(records.map((record)=>[
            record.offer_id,
            record
        ])).values());
}
function describeOffer(record) {
    const price = record.price_step_1_value ? `$${String(record.price_step_1_value).replace(/^\$/, '')}` : 'No price';
    const duration = record.price_step1_duration ? `${record.price_step1_duration} months` : 'no duration';
    return `${record.offer_id}: ${record.offer_name} - ${price} for ${duration}`;
}
function answerQuery(query, records) {
    const normalized = query.trim().toLowerCase();
    const offers = getUniqueOffers(records);
    const uniqueOffers = uniqueByOfferId(records);
    if (!normalized) {
        return {
            title: 'Ask a question about the offer data',
            answer: 'Try asking about offer counts, XM eligibility, divisions, prices, channels, or strategic tags.',
            records: uniqueOffers,
            chips: [
                'sample data',
                `${uniqueOffers.length} unique offers`,
                `${records.length} records`
            ]
        };
    }
    if (normalized.includes('strategic') || normalized.includes('custom_field03') || normalized.includes('group b')) {
        const strategicRecords = uniqueOffers.filter((record)=>includes(record.u_other_eligibility, 'CUSTOM_FIELD03_HSE'));
        return {
            title: 'Strategic offer summary',
            answer: `${strategicRecords.length} of ${uniqueOffers.length} unique offers are strategic. ${strategicRecords.map(describeOffer).join(' ')}`,
            records: strategicRecords,
            chips: [
                'strategic',
                'CUSTOM_FIELD03_HSE',
                `${strategicRecords.length} matches`
            ]
        };
    }
    if (normalized.includes('xm') || normalized.includes('mobile') || normalized.includes('discount')) {
        const xmRecords = uniqueOffers.filter((record)=>Boolean(record.xm_additional_eligibility));
        return {
            title: 'XM eligibility',
            answer: xmRecords.length > 0 ? xmRecords.map((record)=>`${record.offer_id} includes XM terms: ${record.xm_additional_eligibility}.`).join(' ') : 'No unique offers include XM additional eligibility.',
            records: xmRecords,
            chips: [
                'xm',
                'discounts',
                `${xmRecords.length} matches`
            ]
        };
    }
    const division = [
        'central',
        'northeast',
        'west'
    ].find((candidate)=>normalized.includes(candidate));
    if (division) {
        const divisionRecords = records.filter((record)=>includes(record.division, division) || includes(record.dv_region, division));
        const divisionOffers = uniqueByOfferId(divisionRecords);
        return {
            title: `${division.toUpperCase()} availability`,
            answer: `${divisionOffers.length} unique offers have records in ${division.toUpperCase()}: ${divisionOffers.map(describeOffer).join(' ')}`,
            records: divisionOffers,
            chips: [
                division.toUpperCase(),
                `${divisionRecords.length} rows`,
                `${divisionOffers.length} offers`
            ]
        };
    }
    if (normalized.includes('price') || normalized.includes('cost') || normalized.includes('duration') || normalized.includes('month')) {
        return {
            title: 'Price and duration',
            answer: uniqueOffers.map(describeOffer).join(' '),
            records: uniqueOffers,
            chips: [
                'pricing',
                'duration',
                `${uniqueOffers.length} offers`
            ]
        };
    }
    if (normalized.includes('national') || normalized.includes('geographic') || normalized.includes('division')) {
        const nationalOffers = offers.filter((offer)=>offer.records.length >= 3);
        const nationalRecords = uniqueOffers.filter((record)=>nationalOffers.some((offer)=>offer.offer_id === record.offer_id));
        return {
            title: 'Geographic scope',
            answer: nationalOffers.length > 0 ? `${nationalOffers.length} offers appear to be national because they have CENTRAL, NORTHEAST, and WEST rows: ${nationalOffers.map((offer)=>offer.offer_id).join(', ')}.` : 'No offers appear across all three divisions in this sample.',
            records: nationalRecords,
            chips: [
                'geography',
                'national',
                `${nationalOffers.length} offers`
            ]
        };
    }
    if (normalized.includes('channel') || normalized.includes('sales') || normalized.includes('telesales')) {
        const channelSet = new Set();
        records.forEach((record)=>{
            String(record.dv_sales_channel ?? '').split(/[|,]/).map((channel)=>channel.trim()).filter(Boolean).forEach((channel)=>channelSet.add(channel));
        });
        return {
            title: 'Sales channels',
            answer: `The sample data includes these sales channels: ${Array.from(channelSet).join(', ')}.`,
            records: uniqueOffers,
            chips: [
                'channels',
                `${channelSet.size} unique`,
                'eligibility'
            ]
        };
    }
    if (normalized.includes('count') || normalized.includes('how many') || normalized.includes('total')) {
        const strategicCount = uniqueOffers.filter((record)=>includes(record.u_other_eligibility, 'CUSTOM_FIELD03_HSE')).length;
        return {
            title: 'Offer counts',
            answer: `The sample has ${records.length} rows and ${uniqueOffers.length} unique offers. ${strategicCount} are strategic and ${uniqueOffers.length - strategicCount} are standard.`,
            records: uniqueOffers,
            chips: [
                'counts',
                `${records.length} rows`,
                `${uniqueOffers.length} offers`
            ]
        };
    }
    const keywordMatches = uniqueOffers.filter((record)=>[
            record.offer_id,
            record.offer_name,
            record.offer_type,
            record.dv_customer_eligibility,
            record.u_other_eligibility,
            record.dv_sales_channel,
            record.dv_tier_of_service
        ].some((value)=>includes(value, normalized)));
    return {
        title: keywordMatches.length > 0 ? 'Keyword matches' : 'No exact match',
        answer: keywordMatches.length > 0 ? `I found ${keywordMatches.length} unique offers matching "${query}".` : `I could not map "${query}" to a known query pattern. Try asking about counts, XM, strategic offers, divisions, channels, or pricing.`,
        records: keywordMatches,
        chips: keywordMatches.length > 0 ? [
            'keyword search',
            `${keywordMatches.length} matches`
        ] : [
            'try another query'
        ]
    };
}
function NaturalLanguageQueryEngine() {
    const [records, setRecords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('Show offers with XM eligibility');
    const [submittedQuery, setSubmittedQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(query);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchOffers() {
            try {
                setLoading(true);
                const response = await fetch('/api/offers');
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                const data = await response.json();
                setRecords(data.data || []);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch offers:', err);
                setError(err instanceof Error ? err.message : 'Failed to load offers');
                setRecords([]);
            } finally{
                setLoading(false);
            }
        }
        fetchOffers();
    }, []);
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>answerQuery(submittedQuery, records), [
        submittedQuery,
        records
    ]);
    const uniqueOffers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>uniqueByOfferId(records), [
        records
    ]);
    const strategicCount = uniqueOffers.filter((record)=>includes(record.u_other_eligibility, 'CUSTOM_FIELD03_HSE')).length;
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "min-h-screen bg-slate-50 text-slate-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "border-b border-slate-200 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-slate-950",
                                children: "Loading offers from database..."
                            }, void 0, false, {
                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                lineNumber: 213,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-slate-600",
                                children: "Connecting to CastleKeep database"
                            }, void 0, false, {
                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                lineNumber: 214,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                        lineNumber: 212,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                    lineNumber: 211,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                lineNumber: 210,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
            lineNumber: 209,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "min-h-screen bg-slate-50 text-slate-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "border-b border-slate-200 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border border-red-200 bg-red-50 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-xl font-bold text-red-900",
                                children: "Database Connection Error"
                            }, void 0, false, {
                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-red-700",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                lineNumber: 229,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                        lineNumber: 227,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                    lineNumber: 226,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                lineNumber: 225,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
            lineNumber: 224,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-50 text-slate-950",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "border-b border-slate-200 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-3 flex items-center gap-2 text-sm font-semibold text-teal-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MessageSquareText, {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                    lineNumber: 244,
                                                    columnNumber: 17
                                                }, this),
                                                "Natural Language Query Engine"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                            lineNumber: 243,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "max-w-3xl text-4xl font-bold tracking-normal text-slate-950",
                                            children: "Ask plain-English questions about CastleKeep offer data"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                            lineNumber: 247,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                    lineNumber: 242,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-3 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border border-slate-200 bg-slate-50 p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold",
                                                    children: records.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs font-medium uppercase text-slate-500",
                                                    children: "Rows"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                            lineNumber: 252,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border border-slate-200 bg-slate-50 p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold",
                                                    children: uniqueOffers.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs font-medium uppercase text-slate-500",
                                                    children: "Offers"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                    lineNumber: 258,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                            lineNumber: 256,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border border-slate-200 bg-slate-50 p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold",
                                                    children: strategicCount
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs font-medium uppercase text-slate-500",
                                                    children: "Strategic"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                            lineNumber: 260,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                    lineNumber: 251,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "flex flex-col gap-3 border border-slate-200 bg-slate-50 p-3 shadow-sm md:flex-row",
                            onSubmit: (event)=>{
                                event.preventDefault();
                                setSubmittedQuery(query);
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex min-h-12 flex-1 items-center gap-3 bg-white px-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Search, {
                                            className: "text-slate-500",
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                            lineNumber: 275,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: query,
                                            onChange: (event)=>setQuery(event.target.value),
                                            className: "h-12 flex-1 bg-transparent text-base outline-none",
                                            placeholder: "Ask about XM, strategic offers, divisions, pricing, channels..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                            lineNumber: 276,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                    lineNumber: 274,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "inline-flex h-12 items-center justify-center gap-2 bg-teal-700 px-5 text-sm font-bold text-white transition hover:bg-teal-800",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Sparkles, {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                            lineNumber: 287,
                                            columnNumber: 15
                                        }, this),
                                        "Ask"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                    lineNumber: 283,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                            lineNumber: 267,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                    lineNumber: 240,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[280px_1fr] lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-slate-200 bg-white p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 flex items-center gap-2 font-bold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Filter, {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                lineNumber: 298,
                                                columnNumber: 15
                                            }, this),
                                            "Example Queries"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                        lineNumber: 297,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: EXAMPLE_QUERIES.map((example)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setQuery(example);
                                                    setSubmittedQuery(example);
                                                },
                                                className: "block w-full border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800",
                                                children: example
                                            }, example, false, {
                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                lineNumber: 303,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                        lineNumber: 301,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                lineNumber: 296,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-slate-200 bg-white p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 flex items-center gap-2 font-bold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Tags, {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                lineNumber: 320,
                                                columnNumber: 15
                                            }, this),
                                            "Supported Topics"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                        lineNumber: 319,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2",
                                        children: [
                                            'counts',
                                            'XM',
                                            'strategic',
                                            'divisions',
                                            'pricing',
                                            'channels',
                                            'keyword search'
                                        ].map((topic)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600",
                                                children: topic
                                            }, topic, false, {
                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                lineNumber: 325,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                        lineNumber: 323,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                lineNumber: 318,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "border border-slate-200 bg-white p-5 shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 flex flex-wrap items-center justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-1 flex items-center gap-2 text-sm font-semibold text-teal-700",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BarChart3, {
                                                                size: 17
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 338,
                                                                columnNumber: 19
                                                            }, this),
                                                            "Answer"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                        lineNumber: 337,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-2xl font-bold",
                                                        children: result.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                        lineNumber: 341,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                lineNumber: 336,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-2",
                                                children: result.chips.map((chip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bg-slate-900 px-2 py-1 text-xs font-semibold text-white",
                                                        children: chip
                                                    }, chip, false, {
                                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                        lineNumber: 345,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                lineNumber: 343,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                        lineNumber: 335,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-base leading-7 text-slate-700",
                                        children: result.answer
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                        lineNumber: 351,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                lineNumber: 334,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "overflow-hidden border border-slate-200 bg-white shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-b border-slate-200 px-5 py-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg font-bold",
                                            children: "Matching Offers"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                            lineNumber: 356,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                        lineNumber: 355,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "overflow-x-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            className: "w-full min-w-[860px] border-collapse text-left text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                    className: "bg-slate-100 text-xs uppercase text-slate-600",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Offer ID"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 362,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Offer Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 363,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Division"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 364,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Price"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 365,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Duration"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 366,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Channels"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 367,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Eligibility"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 368,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                        lineNumber: 361,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    children: result.records.length > 0 ? result.records.map((record, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "border-t border-slate-100",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 font-bold text-slate-900",
                                                                    children: record.offer_id
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 375,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3",
                                                                    children: record.offer_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 376,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3",
                                                                    children: record.division || record.dv_region || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 377,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3",
                                                                    children: record.price_step_1_value || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 378,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3",
                                                                    children: record.price_step1_duration || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 379,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3",
                                                                    children: record.dv_sales_channel || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 380,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "max-w-[260px] px-4 py-3 text-xs text-slate-600",
                                                                    children: record.u_other_eligibility || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 381,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, `${record.offer_id}-${record.division}-${index}`, true, {
                                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                            lineNumber: 374,
                                                            columnNumber: 23
                                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-8 text-center text-slate-500",
                                                            colSpan: 7,
                                                            children: "No records matched this query."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                            lineNumber: 386,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                        lineNumber: 385,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                    lineNumber: 371,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                            lineNumber: 359,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                        lineNumber: 358,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                        lineNumber: 333,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                lineNumber: 294,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
        lineNumber: 238,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/nl-query/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NaturalLanguageQueryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NaturalLanguageQueryEngine$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/NaturalLanguageQueryEngine.tsx [app-ssr] (ecmascript)");
'use client';
;
;
function NaturalLanguageQueryPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NaturalLanguageQueryEngine$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/src/app/nl-query/page.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime;
}),
];

//# sourceMappingURL=_18eimge._.js.map