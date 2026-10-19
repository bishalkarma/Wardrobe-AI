import { AuthenticatedPlaceholder } from "@/components/authenticated-placeholder";

export default function ProfilePage() {
  return (
    <AuthenticatedPlaceholder
      eyebrow="YOUR ACCOUNT"
      title="Account access"
      description="Your verified sign-in identity appears in the account navigation. Profile details and preferences are not persisted in this stage."
    />
  );
}
