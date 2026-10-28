import { describe, expect, it } from "vitest";
import { parseClothingForm, parseOutfitForm, parseProfileForm, parseUuidSelection } from "../../lib/data/validation";

function form(entries: Record<string, string | string[]>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    for (const item of Array.isArray(value) ? value : [value]) data.append(key, item);
  }
  return data;
}

const itemOne = "a1d9d4de-d7bd-4aab-92c5-bb2c28b8ac11";
const itemTwo = "bba6d80f-7853-43a3-a211-364f1f41bf16";

describe("account form validation", () => {
  it("trims and normalizes a clothing record without requiring optional metadata", () => {
    const result = parseClothingForm(form({ name: "  Linen shirt  ", categoryId: "tops", season: "Spring, summer, Spring", occasions: "Work, Weekend" }));
    expect(result).toEqual({
      ok: true,
      value: {
        name: "Linen shirt",
        categoryId: "tops",
        subcategory: null,
        color: null,
        pattern: null,
        material: null,
        fit: null,
        season: ["Spring", "summer"],
        formality: null,
        occasions: ["Work", "Weekend"],
        brand: null,
        notes: null,
      },
    });
  });

  it("rejects a blank name or unknown category", () => {
    expect(parseClothingForm(form({ name: " ", categoryId: "tops" })).ok).toBe(false);
    expect(parseClothingForm(form({ name: "Coat", categoryId: "unknown" })).ok).toBe(false);
  });

  it("rejects overlong clothing metadata rather than silently truncating it", () => {
    const result = parseClothingForm(form({ name: "Coat", categoryId: "outerwear", notes: "x".repeat(1001) }));
    expect(result).toMatchObject({ ok: false });
  });

  it("accepts a profile with a display name and valid units while leaving preferences optional", () => {
    const result = parseProfileForm(form({ displayName: " Amina ", preferredUnits: "metric" }));
    expect(result).toEqual({
      ok: true,
      value: { displayName: "Amina", preferredUnits: "metric", preferredStyle: null, colorPalette: null, fitPreference: null },
    });
  });

  it("rejects invalid profile units and overlong names", () => {
    expect(parseProfileForm(form({ preferredUnits: "feet" })).ok).toBe(false);
    expect(parseProfileForm(form({ displayName: "x".repeat(81), preferredUnits: "imperial" })).ok).toBe(false);
  });

  it("requires at least one valid owned-item id for an outfit and deduplicates repeated selections", () => {
    const result = parseOutfitForm(form({ name: "Office layers", itemIds: [itemOne, itemOne, itemTwo] }));
    expect(result).toMatchObject({ ok: true, value: { name: "Office layers", itemIds: [itemOne, itemTwo] } });
    expect(parseOutfitForm(form({ name: "Empty look" })).ok).toBe(false);
    expect(parseOutfitForm(form({ name: "Bad look", itemIds: "not-a-uuid" })).ok).toBe(false);
  });

  it("deduplicates valid bulk wardrobe selections", () => {
    expect(parseUuidSelection(form({ itemIds: [itemOne, itemOne, itemTwo] }), "itemIds")).toEqual({
      ok: true,
      value: [itemOne, itemTwo],
    });
  });

  it("rejects empty, malformed, and oversized bulk selections", () => {
    expect(parseUuidSelection(form({}), "itemIds")).toMatchObject({ ok: false, reason: "empty-selection" });
    expect(parseUuidSelection(form({ itemIds: [itemOne, "not-a-uuid"] }), "itemIds")).toMatchObject({ ok: false, reason: "invalid-selection" });
    const tooMany = Array.from({ length: 501 }, (_, index) => `00000000-0000-4000-8000-${index.toString(16).padStart(12, "0")}`);
    expect(parseUuidSelection(form({ itemIds: tooMany }), "itemIds")).toMatchObject({ ok: false, reason: "selection-too-large" });
  });

  it("validates outfit update ids", () => {
    const result = parseOutfitForm(form({ outfitId: "not-an-id", name: "Look", itemIds: itemOne }));
    expect(result).toMatchObject({ ok: false });
  });
});
