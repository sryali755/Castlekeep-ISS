'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  BarChart3,
  Filter,
  MessageSquareText,
  Search,
  Sparkles,
  Tags,
} from '@/lib/icons';
import { OfferProcessor } from '@/lib/offerProcessor';
import { OfferRecord } from '@/lib/types';

type QueryResult = {
  title: string;
  answer: string;
  records: OfferRecord[];
  chips: string[];
};

const EXAMPLE_QUERIES = [
  'How many offers are strategic?',
  'Show offers with XM eligibility',
  'Which offers are available in WEST?',
  'What are the prices and durations?',
  'List national offers',
];

const getUniqueOffers = (records: OfferRecord[]) => OfferProcessor.processOffers(records);

const includes = (value: unknown, needle: string) =>
  String(value ?? '').toLowerCase().includes(needle.toLowerCase());

function uniqueByOfferId(records: OfferRecord[]) {
  return Array.from(new Map(records.map((record) => [record.offer_id, record])).values());
}

function describeOffer(record: OfferRecord) {
  const price = record.price_step_1_value ? `$${String(record.price_step_1_value).replace(/^\$/, '')}` : 'No price';
  const duration = record.price_step1_duration ? `${record.price_step1_duration} months` : 'no duration';
  return `${record.offer_id}: ${record.offer_name} - ${price} for ${duration}`;
}

function answerQuery(query: string, records: OfferRecord[]): QueryResult {
  const normalized = query.trim().toLowerCase();
  const offers = getUniqueOffers(records);
  const uniqueOffers = uniqueByOfferId(records);

  if (!normalized) {
    return {
      title: 'Ask a question about the offer data',
      answer: 'Try asking about offer counts, XM eligibility, divisions, prices, channels, or strategic tags.',
      records: uniqueOffers,
      chips: ['sample data', `${uniqueOffers.length} unique offers`, `${records.length} records`],
    };
  }

  if (normalized.includes('strategic') || normalized.includes('custom_field03') || normalized.includes('group b')) {
    const strategicRecords = uniqueOffers.filter((record) => includes(record.u_other_eligibility, 'CUSTOM_FIELD03_HSE'));
    return {
      title: 'Strategic offer summary',
      answer: `${strategicRecords.length} of ${uniqueOffers.length} unique offers are strategic. ${strategicRecords.map(describeOffer).join(' ')}`,
      records: strategicRecords,
      chips: ['strategic', 'CUSTOM_FIELD03_HSE', `${strategicRecords.length} matches`],
    };
  }

  if (normalized.includes('xm') || normalized.includes('mobile') || normalized.includes('discount')) {
    const xmRecords = uniqueOffers.filter((record) => Boolean(record.xm_additional_eligibility));
    return {
      title: 'XM eligibility',
      answer:
        xmRecords.length > 0
          ? xmRecords
              .map((record) => `${record.offer_id} includes XM terms: ${record.xm_additional_eligibility}.`)
              .join(' ')
          : 'No unique offers include XM additional eligibility.',
      records: xmRecords,
      chips: ['xm', 'discounts', `${xmRecords.length} matches`],
    };
  }

  const division = ['central', 'northeast', 'west'].find((candidate) => normalized.includes(candidate));
  if (division) {
    const divisionRecords = records.filter((record) => includes(record.division, division) || includes(record.dv_region, division));
    const divisionOffers = uniqueByOfferId(divisionRecords);
    return {
      title: `${division.toUpperCase()} availability`,
      answer: `${divisionOffers.length} unique offers have records in ${division.toUpperCase()}: ${divisionOffers.map(describeOffer).join(' ')}`,
      records: divisionOffers,
      chips: [division.toUpperCase(), `${divisionRecords.length} rows`, `${divisionOffers.length} offers`],
    };
  }

  if (normalized.includes('price') || normalized.includes('cost') || normalized.includes('duration') || normalized.includes('month')) {
    return {
      title: 'Price and duration',
      answer: uniqueOffers.map(describeOffer).join(' '),
      records: uniqueOffers,
      chips: ['pricing', 'duration', `${uniqueOffers.length} offers`],
    };
  }

  if (normalized.includes('national') || normalized.includes('geographic') || normalized.includes('division')) {
    const nationalOffers = offers.filter((offer) => offer.records.length >= 3);
    const nationalRecords = uniqueOffers.filter((record) => nationalOffers.some((offer) => offer.offer_id === record.offer_id));
    return {
      title: 'Geographic scope',
      answer:
        nationalOffers.length > 0
          ? `${nationalOffers.length} offers appear to be national because they have CENTRAL, NORTHEAST, and WEST rows: ${nationalOffers
              .map((offer) => offer.offer_id)
              .join(', ')}.`
          : 'No offers appear across all three divisions in this sample.',
      records: nationalRecords,
      chips: ['geography', 'national', `${nationalOffers.length} offers`],
    };
  }

  if (normalized.includes('channel') || normalized.includes('sales') || normalized.includes('telesales')) {
    const channelSet = new Set<string>();
    records.forEach((record) => {
      String(record.dv_sales_channel ?? '')
        .split(/[|,]/)
        .map((channel) => channel.trim())
        .filter(Boolean)
        .forEach((channel) => channelSet.add(channel));
    });
    return {
      title: 'Sales channels',
      answer: `The sample data includes these sales channels: ${Array.from(channelSet).join(', ')}.`,
      records: uniqueOffers,
      chips: ['channels', `${channelSet.size} unique`, 'eligibility'],
    };
  }

  if (normalized.includes('count') || normalized.includes('how many') || normalized.includes('total')) {
    const strategicCount = uniqueOffers.filter((record) => includes(record.u_other_eligibility, 'CUSTOM_FIELD03_HSE')).length;
    return {
      title: 'Offer counts',
      answer: `The sample has ${records.length} rows and ${uniqueOffers.length} unique offers. ${strategicCount} are strategic and ${
        uniqueOffers.length - strategicCount
      } are standard.`,
      records: uniqueOffers,
      chips: ['counts', `${records.length} rows`, `${uniqueOffers.length} offers`],
    };
  }

  const keywordMatches = uniqueOffers.filter((record) =>
    [
      record.offer_id,
      record.offer_name,
      record.offer_type,
      record.dv_customer_eligibility,
      record.u_other_eligibility,
      record.dv_sales_channel,
      record.dv_tier_of_service,
    ].some((value) => includes(value, normalized))
  );

  return {
    title: keywordMatches.length > 0 ? 'Keyword matches' : 'No exact match',
    answer:
      keywordMatches.length > 0
        ? `I found ${keywordMatches.length} unique offers matching "${query}".`
        : `I could not map "${query}" to a known query pattern. Try asking about counts, XM, strategic offers, divisions, channels, or pricing.`,
    records: keywordMatches,
    chips: keywordMatches.length > 0 ? ['keyword search', `${keywordMatches.length} matches`] : ['try another query'],
  };
}

export default function NaturalLanguageQueryEngine() {
  const [records, setRecords] = useState<OfferRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('Show offers with XM eligibility');
  const [submittedQuery, setSubmittedQuery] = useState(query);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, []);

  const result = useMemo(() => answerQuery(submittedQuery, records), [submittedQuery, records]);
  const uniqueOffers = useMemo(() => uniqueByOfferId(records), [records]);
  const strategicCount = uniqueOffers.filter((record) => includes(record.u_other_eligibility, 'CUSTOM_FIELD03_HSE')).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-950">Loading offers from database...</h1>
              <p className="mt-2 text-slate-600">Connecting to CastleKeep database</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h1 className="text-xl font-bold text-red-900">Database Connection Error</h1>
              <p className="mt-2 text-red-700">{error}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-teal-700">
                <MessageSquareText size={18} />
                Natural Language Query Engine
              </div>
              <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-slate-950">
                Ask plain-English questions about CastleKeep offer data
              </h1>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold">{records.length}</div>
                <div className="text-xs font-medium uppercase text-slate-500">Rows</div>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold">{uniqueOffers.length}</div>
                <div className="text-xs font-medium uppercase text-slate-500">Offers</div>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold">{strategicCount}</div>
                <div className="text-xs font-medium uppercase text-slate-500">Strategic</div>
              </div>
            </div>
          </div>

          <form
            className="flex flex-col gap-3 border border-slate-200 bg-slate-50 p-3 shadow-sm md:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedQuery(query);
            }}
          >
            <div className="flex min-h-12 flex-1 items-center gap-3 bg-white px-4">
              <Search className="text-slate-500" size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 flex-1 bg-transparent text-base outline-none"
                placeholder="Ask about XM, strategic offers, divisions, pricing, channels..."
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 bg-teal-700 px-5 text-sm font-bold text-white transition hover:bg-teal-800"
            >
              <Sparkles size={18} />
              Ask
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="space-y-4">
          <div className="border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 font-bold">
              <Filter size={18} />
              Example Queries
            </div>
            <div className="space-y-2">
              {EXAMPLE_QUERIES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    setQuery(example);
                    setSubmittedQuery(example);
                  }}
                  className="block w-full border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 font-bold">
              <Tags size={18} />
              Supported Topics
            </div>
            <div className="flex flex-wrap gap-2">
              {['counts', 'XM', 'strategic', 'divisions', 'pricing', 'channels', 'keyword search'].map((topic) => (
                <span key={topic} className="border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-teal-700">
                  <BarChart3 size={17} />
                  Answer
                </div>
                <h2 className="text-2xl font-bold">{result.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.chips.map((chip) => (
                  <span key={chip} className="bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-base leading-7 text-slate-700">{result.answer}</p>
          </section>

          <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold">Matching Offers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Offer ID</th>
                    <th className="px-4 py-3">Offer Name</th>
                    <th className="px-4 py-3">Division</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Channels</th>
                    <th className="px-4 py-3">Eligibility</th>
                  </tr>
                </thead>
                <tbody>
                  {result.records.length > 0 ? (
                    result.records.map((record, index) => (
                      <tr key={`${record.offer_id}-${record.division}-${index}`} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-bold text-slate-900">{record.offer_id}</td>
                        <td className="px-4 py-3">{record.offer_name}</td>
                        <td className="px-4 py-3">{record.division || record.dv_region || 'N/A'}</td>
                        <td className="px-4 py-3">{record.price_step_1_value || 'N/A'}</td>
                        <td className="px-4 py-3">{record.price_step1_duration || 'N/A'}</td>
                        <td className="px-4 py-3">{record.dv_sales_channel || 'N/A'}</td>
                        <td className="max-w-[260px] px-4 py-3 text-xs text-slate-600">{record.u_other_eligibility || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-8 text-center text-slate-500" colSpan={7}>
                        No records matched this query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
