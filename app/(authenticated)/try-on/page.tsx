import { AuthenticatedPlaceholder } from "@/components/authenticated-placeholder";

export default function TryOnPage() {
  return (
    <AuthenticatedPlaceholder
      eyebrow="TRY-ON"
      title="Try-on is not connected"
      description="Private photo storage and virtual try-on are separate later stages. No personal image is stored and no image-generation provider is called here."
    />
  );
}
