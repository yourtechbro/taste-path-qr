import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { fetchPublicMenu, normalizePhoneForWhatsapp } from "@/lib/menu";
import { FoodCard } from "@/components/menu/FoodCard";

export const Route = createFileRoute("/menu/$slug")({
  head: ({ params }) => {
    const title = `Menu — ${params.slug.replace(/-/g, " ")}`;
    const description = "Browse the full menu, prices and dishes. Scan, tap, order at the table.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "restaurant.menu" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: MenuPage,
});

function MenuPage() {
  const { slug } = Route.useParams();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-menu", slug],
    queryFn: () => fetchPublicMenu(slug),
    staleTime: 60_000,
  });

  const visibleItems = useMemo(() => {
    if (!data) return [];
    if (activeCategory === "all") return data.items;
    return data.items.filter((item) => item.category_id === activeCategory);
  }, [data, activeCategory]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="h-10 w-2/3 animate-pulse rounded-full bg-secondary" />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="h-72 animate-pulse rounded-[18px] bg-secondary" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data || !data.restaurant.is_published) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="max-w-sm text-center">
          <h1 className="font-display text-3xl font-semibold">Menu unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This menu isn&apos;t published yet. Please check with the restaurant.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const { restaurant, categories } = data;
  const whatsapp = restaurant.whatsapp ? normalizePhoneForWhatsapp(restaurant.whatsapp) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="pb-6 pt-10 sm:pt-14">
          <div className="flex items-start gap-4">
            {restaurant.logo_url ? (
              <img
                src={restaurant.logo_url}
                alt={`${restaurant.name} logo`}
                className="size-14 shrink-0 rounded-full object-cover ring-1 ring-foreground/5 sm:size-16"
              />
            ) : (
              <div className="grid size-14 shrink-0 place-items-center rounded-full bg-sage/15 ring-1 ring-foreground/5 sm:size-16">
                <span className="font-display text-xl text-sage">{restaurant.name.charAt(0)}</span>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h1 className="text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  {restaurant.name}
                </h1>
                {restaurant.google_rating && (
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="size-4 fill-terra text-terra" />
                    <span className="font-semibold text-foreground">{restaurant.google_rating}</span>
                    {restaurant.google_review_count ? (
                      <span>· {restaurant.google_review_count.toLocaleString("en-IN")} reviews</span>
                    ) : null}
                  </span>
                )}
              </div>
              {restaurant.description && (
                <p className="mt-2 max-w-[46ch] text-pretty text-sm text-muted-foreground sm:text-base">
                  {restaurant.description}
                </p>
              )}
              {restaurant.address && (
                <p className="mt-1.5 text-sm text-muted-foreground/80">{restaurant.address}</p>
              )}
            </div>
          </div>
        </header>

        <nav className="sticky top-0 z-20 -mx-5 border-b border-border bg-background/95 px-5 py-3 backdrop-blur-sm sm:-mx-8 sm:px-8">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto">
            <CategoryChip
              label="All"
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            />
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                label={category.name}
                active={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </div>
        </nav>

        <section className="py-8">
          {visibleItems.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Nothing in this section yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              {visibleItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="pb-8">
          <div className="rounded-[18px] bg-card p-4 ring-1 ring-foreground/5 sm:p-5">
            <div className="mb-4">
              <p className="font-display text-lg font-semibold">{restaurant.name}</p>
              {restaurant.address && (
                <p className="mt-1 text-sm text-muted-foreground">{restaurant.address}</p>
              )}
              {restaurant.phone && (
                <p className="text-sm text-muted-foreground">{restaurant.phone}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {restaurant.google_maps_url && (
                <ActionLink
                  href={restaurant.google_maps_url}
                  primary
                  icon={<MapPin className="size-4" />}
                  label="Directions"
                />
              )}
              {restaurant.phone && (
                <ActionLink
                  href={`tel:${restaurant.phone}`}
                  icon={<Phone className="size-4" />}
                  label="Call"
                />
              )}
              {whatsapp && (
                <ActionLink
                  href={`https://wa.me/${whatsapp}`}
                  icon={<MessageCircle className="size-4" />}
                  label="WhatsApp"
                />
              )}
              {restaurant.instagram_url && (
                <ActionLink
                  href={restaurant.instagram_url}
                  icon={<Instagram className="size-4" />}
                  label="Instagram"
                />
              )}
            </div>
          </div>
        </section>

        {restaurant.google_review_url && (
          <section className="pb-12">
            <div className="rounded-[18px] bg-sage/10 p-6 text-center ring-1 ring-sage/15 sm:p-8">
              <p className="text-balance font-display text-2xl font-semibold">
                Enjoyed your experience?
              </p>
              <div className="mt-2 flex justify-center gap-1">
                {[0, 1, 2, 3, 4].map((n) => (
                  <Star key={n} className="size-5 fill-terra text-terra" />
                ))}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Leave us a Google Review</p>
              <a
                href={restaurant.google_review_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Star className="size-4" /> Review us on Google
              </a>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-foreground/5"
      }`}
    >
      {label}
    </button>
  );
}

function ActionLink({
  href,
  icon,
  label,
  primary,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-opacity hover:opacity-90 ${
        primary
          ? "bg-primary text-primary-foreground"
          : "bg-background text-foreground ring-1 ring-border"
      }`}
    >
      {icon} {label}
    </a>
  );
}
