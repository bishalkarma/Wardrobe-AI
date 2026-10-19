import { AuthenticatedPlaceholder } from "@/components/authenticated-placeholder";

export default function WardrobePage() {
  return (
    <AuthenticatedPlaceholder
      eyebrow="YOUR WARDROBE"
      title="Your wardrobe is empty"
      description="Garment records and photo uploads are not part of the authentication stage."
    />
  );
}
