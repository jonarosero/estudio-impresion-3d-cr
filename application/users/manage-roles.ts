import type { Account, AccountRole } from "@/domain/users/account";

export function assignRole(users: Account[], userId: string, role: AccountRole) {
  return users.map((user) => user.id === userId ? { ...user, role } : user);
}

export function adminUsers(users: Account[]) {
  return users.filter((user) => user.role === "admin");
}
