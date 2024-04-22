export const SmallLoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center w-3 h-3 rounded-full border-t-2 border-blue-500 border-solid animate-spin"></div>
  );
};

export const SkeletonLoader = () => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-item"></div>
      <div className="skeleton-item"></div>
      <div className="skeleton-item"></div>
    </div>
  );
};
