export type AccountRole = "customer" | "admin";

export type Account = {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
};
