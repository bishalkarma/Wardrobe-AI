import { AuthenticatedPlaceholder } from "@/components/authenticated-placeholder";

export default function StylistPage() {
  return (
    <AuthenticatedPlaceholder
      eyebrow="STYLIST"
      title="Stylist features are not connected"
      description="This account has no wardrobe records, and no AI provider is called. Explore sample recommendations in the separate demo."
    />
  );
}
