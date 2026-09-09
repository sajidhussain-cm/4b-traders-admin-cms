import { createServerSupabase } from "./supabaseServer";

// Small helpers the public pages use to pull live content from Supabase.
// Every table read here is covered by a "public read active/settings" RLS
// policy in supabase/schema.sql, so no secret key is ever needed for this.

export async function getSettings() {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("website_settings").select("*").eq("id", 1).single();
  return data || {};
}

export async function getHomepage() {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("homepage_content").select("*").eq("id", 1).single();
  return data || {};
}

export async function getFeaturedProducts() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .limit(8);
  return data || [];
}

export async function getAllProducts({ categoryId } = {}) {
  const supabase = createServerSupabase();
  let query = supabase.from("products").select("*").eq("active", true).order("created_at", { ascending: false });
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data } = await query;
  return data || [];
}

export async function getProduct(id) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("products").select("*").eq("id", id).eq("active", true).single();
  return data;
}

export async function getCategories() {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("categories").select("*").eq("active", true);
  return data || [];
}

export async function getGallery() {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("gallery").select("*").eq("active", true).order("sort_order");
  return data || [];
}

export async function getTestimonials() {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("testimonials").select("*").eq("active", true);
  return data || [];
}

export async function getAbout() {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("about_content").select("*").eq("id", 1).single();
  return data || {};
}
