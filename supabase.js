// ============================================================
// supabase.js — Shared Supabase Client
// Include this <script> BEFORE any other panel JS file.
// ============================================================

const SUPABASE_URL = "https://owirkihhmnburkkgkkab.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93aXJraWhobW5idXJra2dra2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzI5MTQsImV4cCI6MjA4OTQwODkxNH0.GO77XboJ9fQyDe5LYv4mbJEH_DIVSs9AhTucnSIQfyA";

// Single shared client — reuse everywhere via window.sb
window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Small toast helper (matches existing #toast element in panels) ──
window.showToast = function (msg, isError = false) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.style.background = isError ? '#c0392b' : '#2d6a4f';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
};
