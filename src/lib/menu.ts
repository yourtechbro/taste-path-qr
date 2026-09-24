import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

export type MenuBundle = {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
};

export function formatPrice(value: number | string) {
  const amount = typeof value === "string" ? Number(value) : value;
  return `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export function menuUrl(slug: string) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/menu/${slug}`;
}

export async function fetchPublicMenu(slug: string): Promise<MenuBundle | null> {
  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!restaurant) return null;

  const [categoriesResult, itemsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("position", { ascending: true }),
    supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("position", { ascending: true }),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (itemsResult.error) throw itemsResult.error;

  return {
    restaurant,
    categories: categoriesResult.data ?? [],
    items: itemsResult.data ?? [],
  };
}

export async function fetchMyRestaurant(userId: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

const TEN_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 10;

export async function uploadImage(file: File, userId: string) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from("menu-images").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;

  const { data, error: signError } = await supabase.storage
    .from("menu-images")
    .createSignedUrl(path, TEN_YEARS_IN_SECONDS);
  if (signError) throw signError;

  return data.signedUrl;
}

export function normalizePhoneForWhatsapp(value: string) {
  return value.replace(/[^\d]/g, "");
}
