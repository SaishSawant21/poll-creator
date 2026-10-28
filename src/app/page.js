import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  ChartNoAxesColumn,
  Share2,
  CheckCircle2,
} from "lucide-react";
import dayjs from "dayjs";

const features = [
  {
    icon: Plus,
    title: "Create polls",
    description: "Build polls with multiple options in just a few minutes.",
  },
  {
    icon: Share2,
    title: "Share anywhere",
    description: "Share a link and collect responses from your audience.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "Explore results",
    description: "Understand voting patterns through interactive charts.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tight text-emerald-700">
            Pollify
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>

            <Button asChild>
              <Link href="/dashboard/polls/new">
                <Plus className="mr-2 h-4 w-4" />
                Create poll
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center sm:py-28">
        <p className="mb-5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800">
          Simple. Fast. Interactive.
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Your questions deserve
          <span className="mt-2 block text-emerald-700">
            better answers.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Create polls, collect votes, and discover what people think with
          clear, interactive results.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/dashboard/polls/new">
              <Plus className="mr-2 h-4 w-4" />
              Create your first poll
            </Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">Explore dashboard</Link>
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Easy to create
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Simple to share
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Clear results
          </span>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything you need to run a poll
          </h2>
          <p className="mt-3 text-slate-600">
            From your first question to the final results.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-6 text-center text-sm text-slate-500">
        © {dayjs().format('DD/MM/YYYY')} Pollify. Make every vote count.
      </footer>
    </main>
  );
}