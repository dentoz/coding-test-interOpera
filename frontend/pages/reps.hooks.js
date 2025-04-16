import { useEffect, useState } from "react";

export const useReps = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return {
    loading,
  };
};
