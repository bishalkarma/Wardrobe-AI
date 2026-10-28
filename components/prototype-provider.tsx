"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { INITIAL_FAVORITE_OUTFIT_IDS, INITIAL_SAVED_OUTFIT_IDS, MOCK_OUTFITS, MOCK_WARDROBE } from "@/lib/mock-data";
import type { Outfit, WardrobeItem } from "@/lib/types";

type NewWardrobeItem = Omit<WardrobeItem, "id" | "favorite" | "addedAt">;
type StylePreferences = { style: string; colorPalette: string; fit: string };

const DEFAULT_STYLE_PREFERENCES: StylePreferences = {
  style: "Clean classic",
  colorPalette: "Warm neutrals",
  fit: "Relaxed",
};

type PrototypeState = {
  items: WardrobeItem[];
  savedOutfits: Outfit[];
  favoriteOutfitIds: string[];
  ratings: Record<string, number>;
  samplePhoto: boolean;
  selectedOutfitId: string;
  stylePreferences: StylePreferences;
  notify: (message: string) => void;
  saveStylePreferences: (preferences: StylePreferences) => void;
  addItem: (item: NewWardrobeItem) => void;
  updateItem: (id: string, patch: Partial<WardrobeItem>) => void;
  deleteItem: (id: string) => void;
  toggleItemFavorite: (id: string) => void;
  saveOutfit: (outfit: Outfit) => void;
  unsaveOutfit: (id: string) => void;
  toggleOutfitFavorite: (id: string) => void;
  rateOutfit: (id: string, rating: number) => void;
  setSamplePhoto: (value: boolean) => void;
  setSelectedOutfitId: (id: string) => void;
};

const PrototypeContext = createContext<PrototypeState | null>(null);

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(MOCK_WARDROBE);
  const [savedIds, setSavedIds] = useState(INITIAL_SAVED_OUTFIT_IDS);
  const [favoriteOutfitIds, setFavoriteOutfitIds] = useState(INITIAL_FAVORITE_OUTFIT_IDS);
  const [ratings, setRatings] = useState<Record<string, number>>({ "look-business": 4 });
  const [samplePhoto, setSamplePhoto] = useState(false);
  const [stylePreferences, setStylePreferences] = useState(DEFAULT_STYLE_PREFERENCES);
  const [selectedOutfitId, setSelectedOutfitId] = useState("look-business");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2800);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const addItem = useCallback((item: NewWardrobeItem) => {
    setItems((current) => [
      {
        ...item,
        id: `mock-item-${Date.now()}`,
        favorite: false,
        addedAt: "Added just now · demo only",
      },
      ...current,
    ]);
    notify("Added in temporary demo memory; refreshing restores the original wardrobe.");
  }, [notify]);

  const updateItem = useCallback((id: string, patch: Partial<WardrobeItem>) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
    notify("Changes updated in temporary demo memory; refreshing resets them.");
  }, [notify]);

  const deleteItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    notify("Removed from temporary demo memory; refreshing restores the sample wardrobe.");
  }, [notify]);

  const toggleItemFavorite = useCallback((id: string) => {
    const item = items.find((current) => current.id === id);
    if (!item) return;

    setItems((current) => current.map((currentItem) => currentItem.id === id
      ? { ...currentItem, favorite: !currentItem.favorite }
      : currentItem));
    notify(item.favorite
      ? "Removed from favorites in temporary demo memory; refresh restores the original state."
      : "Added to favorites in temporary demo memory; refresh resets it.");
  }, [items, notify]);

  const saveOutfit = useCallback((outfit: Outfit) => {
    setSavedIds((current) => current.includes(outfit.id) ? current : [...current, outfit.id]);
    notify("Outfit saved for this demo.");
  }, [notify]);

  const unsaveOutfit = useCallback((id: string) => {
    setSavedIds((current) => current.filter((savedId) => savedId !== id));
    notify("Outfit removed from saved looks.");
  }, [notify]);

  const toggleOutfitFavorite = useCallback((id: string) => {
    setFavoriteOutfitIds((current) => current.includes(id)
      ? current.filter((favoriteId) => favoriteId !== id)
      : [...current, id]);
    setSavedIds((current) => current.includes(id) ? current : [...current, id]);
  }, []);

  const rateOutfit = useCallback((id: string, rating: number) => {
    setRatings((current) => ({ ...current, [id]: rating }));
    notify("Thanks — your rating is saved for this demo.");
  }, [notify]);

  const saveStylePreferences = useCallback((preferences: StylePreferences) => {
    setStylePreferences(preferences);
    notify("Preferences updated in temporary demo memory; refresh restores the defaults.");
  }, [notify]);

  const savedOutfits = useMemo(
    () => MOCK_OUTFITS.filter((outfit) => savedIds.includes(outfit.id)),
    [savedIds],
  );

  const value: PrototypeState = {
    items,
    savedOutfits,
    favoriteOutfitIds,
    ratings,
    samplePhoto,
    selectedOutfitId,
    stylePreferences,
    notify,
    saveStylePreferences,
    addItem,
    updateItem,
    deleteItem,
    toggleItemFavorite,
    saveOutfit,
    unsaveOutfit,
    toggleOutfitFavorite,
    rateOutfit,
    setSamplePhoto,
    setSelectedOutfitId,
  };

  return (
    <PrototypeContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast && <div className="toast-message">{toast}</div>}
      </div>
    </PrototypeContext.Provider>
  );
}

export function usePrototype() {
  const context = useContext(PrototypeContext);
  if (!context) throw new Error("usePrototype must be used within PrototypeProvider");
  return context;
}
