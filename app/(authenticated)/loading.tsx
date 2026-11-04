export default function AuthenticatedLoading() {
  return (
    <div className="page-stack account-loading" aria-busy="true" aria-label="Loading your account">
      <div className="loading-heading">
        <span className="loading-skeleton loading-eyebrow" />
        <span className="loading-skeleton loading-title" />
        <span className="loading-skeleton loading-subtitle" />
      </div>
      <div className="loading-skeleton loading-feature" />
      <div className="loading-skeleton loading-feature loading-feature-short" />
      <p className="sr-only" role="status">Loading your private account.</p>
    </div>
  );
}
