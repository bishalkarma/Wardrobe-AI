import { AuthenticatedPlaceholder } from "@/components/authenticated-placeholder";

export default function OutfitDetailPage() {
  return (
    <AuthenticatedPlaceholder
      eyebrow="OUTFIT DETAILS"
      title="Outfit records are not available yet"
      description="This account has no saved outfit records. Sample outfits remain in the separate demo."
    />
  );
}
