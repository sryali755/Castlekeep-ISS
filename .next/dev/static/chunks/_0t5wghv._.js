(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/offerProcessor.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/NaturalLanguageQueryEngine.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NaturalLanguageQueryEngine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'lucide-react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offerProcessor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/offerProcessor.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
const getUniqueOffers = (records)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$offerProcessor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OfferProcessor"].processOffers(records);
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
    _s();
    const [records, setRecords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Show offers with XM eligibility');
    const [submittedQuery, setSubmittedQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(query);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NaturalLanguageQueryEngine.useEffect": ()=>{
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
        }
    }["NaturalLanguageQueryEngine.useEffect"], []);
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "NaturalLanguageQueryEngine.useMemo[result]": ()=>answerQuery(submittedQuery, records)
    }["NaturalLanguageQueryEngine.useMemo[result]"], [
        submittedQuery,
        records
    ]);
    const uniqueOffers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "NaturalLanguageQueryEngine.useMemo[uniqueOffers]": ()=>uniqueByOfferId(records)
    }["NaturalLanguageQueryEngine.useMemo[uniqueOffers]"], [
        records
    ]);
    const strategicCount = uniqueOffers.filter((record)=>includes(record.u_other_eligibility, 'CUSTOM_FIELD03_HSE')).length;
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "min-h-screen bg-slate-50 text-slate-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "border-b border-slate-200 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-slate-950",
                                children: "Loading offers from database..."
                            }, void 0, false, {
                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                lineNumber: 213,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "min-h-screen bg-slate-50 text-slate-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "border-b border-slate-200 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border border-red-200 bg-red-50 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-xl font-bold text-red-900",
                                children: "Database Connection Error"
                            }, void 0, false, {
                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-50 text-slate-950",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "border-b border-slate-200 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-3 flex items-center gap-2 text-sm font-semibold text-teal-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessageSquareText, {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-3 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border border-slate-200 bg-slate-50 p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold",
                                                    children: records.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border border-slate-200 bg-slate-50 p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold",
                                                    children: uniqueOffers.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border border-slate-200 bg-slate-50 p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold",
                                                    children: strategicCount
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "flex flex-col gap-3 border border-slate-200 bg-slate-50 p-3 shadow-sm md:flex-row",
                            onSubmit: (event)=>{
                                event.preventDefault();
                                setSubmittedQuery(query);
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex min-h-12 flex-1 items-center gap-3 bg-white px-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Search, {
                                            className: "text-slate-500",
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                            lineNumber: 275,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "inline-flex h-12 items-center justify-center gap-2 bg-teal-700 px-5 text-sm font-bold text-white transition hover:bg-teal-800",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Sparkles, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[280px_1fr] lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-slate-200 bg-white p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 flex items-center gap-2 font-bold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Filter, {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: EXAMPLE_QUERIES.map((example)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-slate-200 bg-white p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 flex items-center gap-2 font-bold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tags, {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2",
                                        children: [
                                            'counts',
                                            'XM',
                                            'strategic',
                                            'divisions',
                                            'pricing',
                                            'channels',
                                            'keyword search'
                                        ].map((topic)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "border border-slate-200 bg-white p-5 shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 flex flex-wrap items-center justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-1 flex items-center gap-2 text-sm font-semibold text-teal-700",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BarChart3, {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-2",
                                                children: result.chips.map((chip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "overflow-hidden border border-slate-200 bg-white shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-b border-slate-200 px-5 py-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "overflow-x-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            className: "w-full min-w-[860px] border-collapse text-left text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                    className: "bg-slate-100 text-xs uppercase text-slate-600",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Offer ID"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 362,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Offer Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 363,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Division"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 364,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Price"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 365,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Duration"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 366,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3",
                                                                children: "Channels"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                lineNumber: 367,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    children: result.records.length > 0 ? result.records.map((record, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "border-t border-slate-100",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 font-bold text-slate-900",
                                                                    children: record.offer_id
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 375,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3",
                                                                    children: record.offer_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 376,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3",
                                                                    children: record.division || record.dv_region || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 377,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3",
                                                                    children: record.price_step_1_value || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 378,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3",
                                                                    children: record.price_step1_duration || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 379,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3",
                                                                    children: record.dv_sales_channel || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/NaturalLanguageQueryEngine.tsx",
                                                                    lineNumber: 380,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
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
                                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
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
_s(NaturalLanguageQueryEngine, "HjSMGbymPWsPxE3o7vIvu73iuVI=");
_c = NaturalLanguageQueryEngine;
var _c;
__turbopack_context__.k.register(_c, "NaturalLanguageQueryEngine");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/nl-query/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NaturalLanguageQueryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NaturalLanguageQueryEngine$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/NaturalLanguageQueryEngine.tsx [app-client] (ecmascript)");
'use client';
;
;
function NaturalLanguageQueryPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NaturalLanguageQueryEngine$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/src/app/nl-query/page.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
_c = NaturalLanguageQueryPage;
var _c;
__turbopack_context__.k.register(_c, "NaturalLanguageQueryPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_0t5wghv._.js.map