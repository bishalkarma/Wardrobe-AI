export const WARDROBE_BULK_DELETE_FORM_ID = "wardrobe-bulk-delete-form";
export const WARDROBE_BULK_ARCHIVE_FORM_ID = "wardrobe-bulk-archive-form";

export function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}
