import { useAuth } from "../hooks/useAuth";
import { useUserRole } from "../hooks/useUserRole";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const user = useAuth();
  const role = useUserRole(user?.uid);
  const router = useRouter();

  useEffect(() => {
    if (role !== "admin") {
      router.push("/");
    }
  }, [role, router]);

  return <>{role === "admin" && children}</>;
}