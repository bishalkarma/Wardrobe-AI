import { AuthenticatedPlaceholder } from "@/components/authenticated-placeholder";

export default function ProfilePhotoPage() {
  return (
    <AuthenticatedPlaceholder
      eyebrow="PROFILE PHOTO"
      title="Photo uploads are not enabled"
      description="Personal-photo selection, upload, and Storage are reserved for a later approved stage. No image has been uploaded."
    />
  );
}
