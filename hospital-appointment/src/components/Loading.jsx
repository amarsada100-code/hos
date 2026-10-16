
export default function Loading() {
  return (
    <div className="loading-message" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <p>Loading MediCare+...</p>
    </div>
  );
}
