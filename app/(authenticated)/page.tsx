import { AuthenticatedPlaceholder } from "@/components/authenticated-placeholder";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AccountHomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const notice = Array.isArray(params.notice) ? params.notice[0] : params.notice;
  const passwordUpdated = notice === "password-updated";

  return (
    <AuthenticatedPlaceholder
      eyebrow="YOUR ACCOUNT"
      title="A fresh start for your wardrobe"
      description="You’re signed in. This account has no wardrobe or outfit records yet."
      successNotice={passwordUpdated ? "Your password has been updated." : undefined}
    />
  );
}
