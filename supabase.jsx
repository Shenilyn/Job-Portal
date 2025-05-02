// supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nhfxoquqiwcdhlmbuqnk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZnhvcXVxaXdjZGhsbWJ1cW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjA5MzQsImV4cCI6MjA1OTczNjkzNH0.C148-f6VfxA0qJLSiqnRHRjaiEGc6wdJVBgzH5jf_C4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
