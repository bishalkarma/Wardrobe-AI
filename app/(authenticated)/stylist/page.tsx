import { AuthenticatedPlaceholder } from "@/components/authenticated-placeholder";

export default function StylistPage() {
  return (
    <AuthenticatedPlaceholder
      eyebrow="STYLIST"
      title="Stylist features are not connected"
      description="The real stylist will use only pieces you save to this account. AI recommendations are not connected yet, so no provider is called here."
    />
  );
}
