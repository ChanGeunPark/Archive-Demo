import Link from "next/link";
import KeyboardArrowLeftIcon from "@/components/icons/arrow/KeyboardArrowLeftIcon";
import Typography from "@/components/typography/Typography";
import { TechnicalNotes } from "../_components/TechnicalNotes";

export default function ImageMarketplaceTechnicalNotesPage() {
  return (
    <main className="min-h-screen bg-[#F4F5F6] text-[#17191C]">
      <header className="sticky top-0 z-10 border-b border-[#EDEEEF] bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/demos/image-marketplace-flow"
            className="flex items-center gap-1.5 transition hover:opacity-80"
          >
            <span className="text-2xl leading-none text-[#60656C]">
              <KeyboardArrowLeftIcon />
            </span>
            <Typography as="span" variant="body2" weight={600} color="#60656C">
              Image Marketplace Demo
            </Typography>
          </Link>
        </div>
      </header>

      <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <TechnicalNotes />
      </article>
    </main>
  );
}
