import { AuthenticatedPlaceholder } from "@/components/authenticated-placeholder";

export default function TryOnPage() {
  return (
    <AuthenticatedPlaceholder
      eyebrow="TRY-ON"
      title="Try-on is not connected"
      description="No personal images are stored and no image-generation provider is called. The illustrative try-on remains demo-only."
    />
  );
}
