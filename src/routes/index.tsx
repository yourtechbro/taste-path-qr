import { createFileRoute, Link } from "@tanstack/react-router";
import { QrCode, Smartphone, UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MenuCard — QR digital menus for restaurants and cafés" },
      {
        name: "description",
        content:
          "Build a digital menu in minutes, publish it, and print one QR code. Customers scan and your menu opens instantly on their phone.",
      },
      { property: "og:title", content: "MenuCard — QR digital menus for restaurants and cafés" },
      {
        property: "og:description",
        content: "Build a digital menu in minutes, publish it, and print one QR code.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <span className="font-display text-lg font-semibold">MenuCard</span>
          <Link
            to="/auth"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Restaurant login
          </Link>
        </header>

        <section className="py-12 sm:py-20">
          <h1 className="max-w-[18ch] text-balance font-display text-4xl font-semibold leading-tight sm:text-6xl">
            A digital menu your guests open in one scan.
          </h1>
          <p className="mt-4 max-w-[52ch] text-pretty text-base text-muted-foreground">
            Add your dishes, publish the menu, print the QR code. No apps, no logins, no waiting for
            a printed card to be reprinted.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/menu/$slug"
              params={{ slug: "spice-garden" }}
              className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              See a live menu
            </Link>
            <Link
              to="/auth"
              className="rounded-full bg-card px-5 py-3 text-sm font-medium ring-1 ring-border"
            >
              Create your menu
            </Link>
          </div>
        </section>

        <section className="grid gap-4 pb-20 sm:grid-cols-3">
          <Step
            icon={<UtensilsCrossed className="size-5 text-sage" />}
            title="Build the menu"
            body="Categories, dishes, photos, prices and veg markers — edited any time."
          />
          <Step
            icon={<QrCode className="size-5 text-sage" />}
            title="Print one QR code"
            body="Your code never changes, even when the menu does."
          />
          <Step
            icon={<Smartphone className="size-5 text-sage" />}
            title="Guests scan at the table"
            body="A fast, mobile-first menu with directions, call and review links."
          />
        </section>
      </div>
    </div>
  );
}

function Step({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-[18px] bg-card p-5 ring-1 ring-foreground/5">
      <div className="grid size-10 place-items-center rounded-full bg-sage/10">{icon}</div>
      <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
