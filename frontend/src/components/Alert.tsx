import type { ReactNode } from "react";

type AlertProps = {
  type: "success" | "error";
  children: ReactNode;
};

const styles = {
  success: "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300",
  error: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export default function Alert({ type, children }: AlertProps) {
  return (
    <p
      role={type === "error" ? "alert" : "status"}
      className={`rounded-md px-3 py-2 text-sm ${styles[type]}`}
    >
      {children}
    </p>
  );
}
