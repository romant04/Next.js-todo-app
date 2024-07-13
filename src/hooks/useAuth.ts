import { useEffect, useState } from "react";
import { UserData } from "@/src/types/user";

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    const checkToken = async () => {
      const res = await fetch(`/api/auth/checkToken?token=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      setLoading(false);
      const valid = json.isValid;

      if (!valid) return;
      setUser({ ...json.user });
    };

    if (!token) {
      setLoading(false);
      return;
    }
    void checkToken();
  }, []);

  return { user, loading };
};
