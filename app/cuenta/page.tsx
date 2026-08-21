import { AccountView } from "@/components/account/account-view";
import { AccountQuickLinks } from "@/components/account/account-quick-links";

export const metadata = { title: "Mi cuenta" };

export default function AccountPage() {
  return <div className="account-page"><AccountQuickLinks /><AccountView /></div>;
}
