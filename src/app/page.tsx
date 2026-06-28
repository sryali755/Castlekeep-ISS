import Link from 'next/link';
import { FileSpreadsheet, MessageSquareText } from 'lucide-react';

const tools = [
  {
    href: '/iss',
    title: 'ISS Test Plan Generator',
    description: 'Type an ISS number and download an Excel test plan.',
    icon: FileSpreadsheet,
  },
  {
    href: '/nl-query',
    title: 'Natural Language Query Engine',
    description: 'Ask English questions about the embedded CastleKeep sample data.',
    icon: MessageSquareText,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-normal">Atlas Offer Tools</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-700 hover:shadow-md"
              >
                <Icon className="mb-4 text-teal-700" size={30} />
                <h2 className="text-xl font-bold">{tool.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
