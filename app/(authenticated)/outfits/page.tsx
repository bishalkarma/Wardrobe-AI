import { AuthenticatedPlaceholder } from "@/components/authenticated-placeholder";

export default function OutfitsPage() {
  return (
    <AuthenticatedPlaceholder
      eyebrow="SAVED LOOKS"
      title="No saved outfits yet"
      description="Outfit recommendations and saving are not connected to your account in this stage."
    />
  );
}
