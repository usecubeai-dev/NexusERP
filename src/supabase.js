import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://gfevthoabekiigqwvvsz.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZXZ0aG9hYmVraWlncXd2dnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODY2NjUsImV4cCI6MjA5NDI2MjY2NX0.oKJQFlF4mLDo1oLqcH1HvguQs4nuCqvBvY6cnubWtgw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// Stripe payment links por plano
export const STRIPE_LINKS = {
  plus: "https://buy.stripe.com/dRm8wJ3xGakF2yM9RRcwg07",
  pro:  "https://buy.stripe.com/6oU8wJeck3Whc9m5BBcwg08",
};
