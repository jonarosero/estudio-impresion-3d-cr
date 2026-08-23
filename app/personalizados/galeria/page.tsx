import { CustomPrintGallery } from "@/components/quotes/custom-print-gallery";

export const metadata = { title: "Piezas creadas" };

export default function CustomPrintGalleryPage() {
  return (
    <main className="page-shell py-10 sm:py-16">
      <CustomPrintGallery standalone />
    </main>
  );
}
