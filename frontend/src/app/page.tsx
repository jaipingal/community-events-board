import Link from "next/link";
import {
  Baby,
  Bell,
  Hammer,
  Heart,
  Music,
  Palette,
  Search,
  Trophy,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import HomeActions from "@/components/HomeActions";

const categories: { name: string; value: string; description: string; icon: LucideIcon }[] = [
  { name: "Music", value: "MUSIC", description: "Concerts, gigs and open mics", icon: Music },
  { name: "Workshop", value: "WORKSHOP", description: "Learn something new, hands-on", icon: Hammer },
  { name: "Food", value: "FOOD", description: "Festivals, tastings and street food", icon: UtensilsCrossed },
  { name: "Sports", value: "SPORTS", description: "Runs, leagues and tournaments", icon: Trophy },
  { name: "Kids", value: "KIDS", description: "Fun for the little ones", icon: Baby },
];

const features: { title: string; text: string; icon: LucideIcon }[] = [
  {
    title: "Filter and search",
    text: "Narrow upcoming events by category and city, or search by name.",
    icon: Search,
  },
  {
    title: "Your own feed",
    text: "Pick your favourite categories and see matching events in one list.",
    icon: Heart,
  },
  {
    title: "Reminders",
    text: "Set a reminder on any event. It is saved to your account.",
    icon: Bell,
  },
  {
    title: "Event card designer",
    text: "Choose a theme and add up to three stickers to design a card.",
    icon: Palette,
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-4 py-12 text-center sm:gap-6 sm:px-6 sm:py-20 lg:py-28">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
          Find events happening in your city
        </h1>
        <p className="max-w-xl text-base text-zinc-600 sm:text-lg lg:max-w-2xl dark:text-zinc-400">
          Music, workshops, food, sports and kids&apos; events from your
          community. Save the ones you like and set reminders.
        </p>
        <HomeActions />
      </section>

      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <h2 className="text-xl font-semibold sm:text-2xl">Browse by category</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Choose a category to see upcoming events.
          </p>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {categories.map(({ name, value, description, icon: Icon }) => (
              <li key={name} className="last:col-span-2 sm:last:col-span-1">
                <Link
                  href={`/events?category=${value}`}
                  className="flex h-full flex-col gap-2 rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
                >
                  <Icon className="size-6" aria-hidden="true" />
                  <span className="font-medium">{name}</span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <h2 className="text-xl font-semibold sm:text-2xl">What you can do</h2>

          <ul className="mt-6 grid gap-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ title, text, icon: Icon }) => (
              <li key={title} className="flex gap-4 lg:flex-col">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-zinc-200 px-4 py-6 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        Community Events Board
      </footer>
    </main>
  );
}
