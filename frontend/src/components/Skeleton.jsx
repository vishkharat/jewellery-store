function Skeleton({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-stone-200/90 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}

export default Skeleton;