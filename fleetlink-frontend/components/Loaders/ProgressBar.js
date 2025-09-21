"use client";
import NextTopLoader from "nextjs-toploader";

const ProgressBar = () => {
  return (
    <NextTopLoader
      color="#1cd254"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
    />
  );
};

export default ProgressBar;
