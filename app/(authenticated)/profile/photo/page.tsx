import { AuthenticatedPlaceholder } from "@/components/authenticated-placeholder";

export default function ProfilePhotoPage() {
  return (
    <AuthenticatedPlaceholder
      eyebrow="PROFILE PHOTO"
      title="Photo uploads are not enabled"
      description="Personal-photo selection, upload, and private Storage are reserved for a later stage. You can already save your name and style preferences in your profile; no image has been uploaded."
    />
  );
}
