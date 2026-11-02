"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Deneme sürümü: favoriler ve karşılaştırma listesi tarayıcıda (localStorage) tutulur.
 * Kullanıcı hesapları eklendiğinde veritabanına taşınacak.
 */

const MAX_COMPARE = 4;
const KEY = "parfum-nota:v1";

interface StoreState {
  favorites: string[];
  compare: string[];
}

interface Store extends StoreState {
  toggleFavorite: (slug: string) => void;
  toggleCompare: (slug: string) => boolean;
  clearCompare: () => void;
  maxCompare: number;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>({ favorites: [], compare: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({
          favorites: Array.isArray(parsed.favorites) ? parsed.favorites.filter((s: unknown) => typeof s === "string") : [],
          compare: Array.isArray(parsed.compare) ? parsed.compare.filter((s: unknown) => typeof s === "string").slice(0, MAX_COMPARE) : [],
        });
      }
    } catch {
      /* depolama kullanılamıyor; boş durumla devam */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* yoksay */
    }
  }, [state, loaded]);

  const toggleFavorite = useCallback((slug: string) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(slug) ? s.favorites.filter((x) => x !== slug) : [...s.favorites, slug],
    }));
  }, []);

  const toggleCompare = useCallback(
    (slug: string) => {
      if (!state.compare.includes(slug) && state.compare.length >= MAX_COMPARE) return false;
      setState((s) => ({
        ...s,
        compare: s.compare.includes(slug) ? s.compare.filter((x) => x !== slug) : [...s.compare, slug],
      }));
      return true;
    },
    [state.compare],
  );

  const clearCompare = useCallback(() => setState((s) => ({ ...s, compare: [] })), []);

  const value = useMemo(
    () => ({ ...state, toggleFavorite, toggleCompare, clearCompare, maxCompare: MAX_COMPARE }),
    [state, toggleFavorite, toggleCompare, clearCompare],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore, StoreProvider içinde kullanılmalı");
  return ctx;
}
