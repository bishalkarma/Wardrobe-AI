export const CLOTHING_CATEGORY_OPTIONS = [
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "shoes", label: "Shoes" },
  { id: "outerwear", label: "Outerwear" },
  { id: "accessories", label: "Accessories" },
] as const;

export type ClothingCategoryId = (typeof CLOTHING_CATEGORY_OPTIONS)[number]["id"];

export type FormResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: string };

export type ClothingFormValue = {
  name: string;
  categoryId: ClothingCategoryId;
  subcategory: string | null;
  color: string | null;
  pattern: string | null;
  material: string | null;
  fit: string | null;
  season: string[];
  formality: string | null;
  occasions: string[];
  brand: string | null;
  notes: string | null;
};

export type ProfileFormValue = {
  displayName: string | null;
  preferredUnits: "metric" | "imperial";
  preferredStyle: string | null;
  colorPalette: string | null;
  fitPreference: string | null;
};

export type OutfitFormValue = {
  id: string | null;
  name: string;
  occasion: string | null;
  style: string | null;
  reason: string | null;
  itemIds: string[];
};

function textField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(formData: FormData, key: string, maxLength: number): FormResult<string | null> {
  const value = textField(formData, key);
  if (value.length > maxLength) return { ok: false, reason: `${key}-too-long` };
  return { ok: true, value: value || null };
}

function parseDelimitedList(value: string, maxItems: number, maxLength: number): FormResult<string[]> {
  const values = [...new Set(value.split(",").map((part) => part.trim()).filter(Boolean))];
  if (values.length > maxItems || values.some((part) => part.length > maxLength)) {
    return { ok: false, reason: "list-too-long" };
  }
  return { ok: true, value: values };
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export const MAX_BULK_SELECTION = 500;

export function parseUuidSelection(formData: FormData, fieldName: string, maximum = MAX_BULK_SELECTION): FormResult<string[]> {
  const ids = [...new Set(formData.getAll(fieldName)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean))];
  if (ids.length === 0) return { ok: false, reason: "empty-selection" };
  if (ids.length > maximum) return { ok: false, reason: "selection-too-large" };
  if (ids.some((id) => !isUuid(id))) return { ok: false, reason: "invalid-selection" };
  return { ok: true, value: ids };
}

export function parseClothingForm(formData: FormData): FormResult<ClothingFormValue> {
  const name = textField(formData, "name");
  if (!name || name.length > 120) return { ok: false, reason: "invalid-name" };

  const categoryId = textField(formData, "categoryId");
  if (!CLOTHING_CATEGORY_OPTIONS.some((category) => category.id === categoryId)) {
    return { ok: false, reason: "invalid-category" };
  }

  const subcategory = optionalText(formData, "subcategory", 80);
  const color = optionalText(formData, "color", 80);
  const pattern = optionalText(formData, "pattern", 80);
  const material = optionalText(formData, "material", 80);
  const fit = optionalText(formData, "fit", 80);
  const formality = optionalText(formData, "formality", 80);
  const brand = optionalText(formData, "brand", 80);
  const notes = optionalText(formData, "notes", 1000);
  const season = parseDelimitedList(textField(formData, "season"), 8, 40);
  const occasions = parseDelimitedList(textField(formData, "occasions"), 12, 60);
  const parsedFields = [subcategory, color, pattern, material, fit, formality, brand, notes, season, occasions];
  const failure = parsedFields.find((result) => !result.ok);
  if (failure && !failure.ok) return failure;
  if (!season.ok) return season;
  if (!occasions.ok) return occasions;

  return {
    ok: true,
    value: {
      name,
      categoryId: categoryId as ClothingCategoryId,
      subcategory: subcategory.ok ? subcategory.value : null,
      color: color.ok ? color.value : null,
      pattern: pattern.ok ? pattern.value : null,
      material: material.ok ? material.value : null,
      fit: fit.ok ? fit.value : null,
      season: season.value,
      formality: formality.ok ? formality.value : null,
      occasions: occasions.value,
      brand: brand.ok ? brand.value : null,
      notes: notes.ok ? notes.value : null,
    },
  };
}

export function parseProfileForm(formData: FormData): FormResult<ProfileFormValue> {
  const displayName = optionalText(formData, "displayName", 80);
  const preferredStyle = optionalText(formData, "preferredStyle", 80);
  const colorPalette = optionalText(formData, "colorPalette", 80);
  const fitPreference = optionalText(formData, "fitPreference", 80);
  const fields = [displayName, preferredStyle, colorPalette, fitPreference];
  const failure = fields.find((result) => !result.ok);
  if (failure && !failure.ok) return failure;

  const preferredUnits = textField(formData, "preferredUnits");
  if (preferredUnits !== "metric" && preferredUnits !== "imperial") {
    return { ok: false, reason: "invalid-units" };
  }

  return {
    ok: true,
    value: {
      displayName: displayName.ok ? displayName.value : null,
      preferredUnits,
      preferredStyle: preferredStyle.ok ? preferredStyle.value : null,
      colorPalette: colorPalette.ok ? colorPalette.value : null,
      fitPreference: fitPreference.ok ? fitPreference.value : null,
    },
  };
}

export function parseOutfitForm(formData: FormData): FormResult<OutfitFormValue> {
  const name = textField(formData, "name");
  if (!name || name.length > 120) return { ok: false, reason: "invalid-name" };

  const idValue = textField(formData, "outfitId");
  if (idValue && !isUuid(idValue)) return { ok: false, reason: "invalid-id" };

  const occasion = optionalText(formData, "occasion", 80);
  const style = optionalText(formData, "style", 80);
  const reason = optionalText(formData, "reason", 1000);
  const fields = [occasion, style, reason];
  const failure = fields.find((result) => !result.ok);
  if (failure && !failure.ok) return failure;

  const itemIds = [...new Set(formData.getAll("itemIds").filter((value): value is string => typeof value === "string").map((value) => value.trim()).filter(Boolean))];
  if (itemIds.length === 0 || itemIds.length > 30 || itemIds.some((id) => !isUuid(id))) {
    return { ok: false, reason: "invalid-items" };
  }

  return {
    ok: true,
    value: {
      id: idValue || null,
      name,
      occasion: occasion.ok ? occasion.value : null,
      style: style.ok ? style.value : null,
      reason: reason.ok ? reason.value : null,
      itemIds,
    },
  };
}
