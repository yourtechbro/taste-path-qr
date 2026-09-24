import { useState } from "react";
import type { MenuItem } from "@/lib/menu";
import { formatPrice } from "@/lib/menu";

export function VegBadge({ isVeg }: { isVeg: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-medium text-foreground/70 ring-1 ring-foreground/5">
      <span
        className={`grid size-3 place-items-center rounded-[3px] border-[1.5px] ${
          isVeg ? "border-sage" : "border-terra"
        }`}
      >
        <span className={`size-1.5 rounded-full ${isVeg ? "bg-sage" : "bg-terra"}`} />
      </span>
      {isVeg ? "Veg" : "Non-veg"}
    </span>
  );
}

export function FoodCard({ item }: { item: MenuItem }) {
  const [broken, setBroken] = useState(false);
  const unavailable = !item.is_available;

  return (
    <article className="fade-up overflow-hidden rounded-[18px] bg-card ring-1 ring-foreground/5">
      <div className="relative">
        {item.image_url && !broken ? (
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className={`aspect-[4/3] w-full object-cover ${unavailable ? "opacity-50" : ""}`}
          />
        ) : (
          <div
            className={`grid aspect-[4/3] w-full place-items-center bg-secondary ${
              unavailable ? "opacity-50" : ""
            }`}
          >
            <span className="font-display text-2xl text-muted-foreground">{item.name.charAt(0)}</span>
          </div>
        )}

        <span className="absolute left-3 top-3">
          <VegBadge isVeg={item.is_veg} />
        </span>

        {unavailable && (
          <span className="absolute right-3 top-3 rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-medium text-background">
            Sold out
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`text-balance font-display text-xl font-semibold ${
              unavailable ? "text-muted-foreground" : ""
            }`}
          >
            {item.name}
          </h3>
          <span
            className={`whitespace-nowrap font-display text-lg font-semibold ${
              unavailable ? "text-muted-foreground" : ""
            }`}
          >
            {formatPrice(item.price)}
          </span>
        </div>
        {item.description && (
          <p className="mt-1.5 text-pretty text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>
    </article>
  );
}
