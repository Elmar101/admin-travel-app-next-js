import { getDictionary } from "@/app/[lang]/dictionaries";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";

interface HomeProps {
  searchParams?: Promise<{ lang?: string }>;
}

const getLangHref = (nextLang: Locale) => ({
  pathname: "/",
  query: { lang: nextLang },
});

export default async function Home({ searchParams }: HomeProps) {
  const { lang: langParam } = (await searchParams) ?? {};
  const lang: Locale = langParam === "az" ? "az" : "en";
  const dict = await getDictionary(lang);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Language:</span>
        <Link
          href={getLangHref("en")}
          className={`rounded border px-3 py-1 text-sm ${
            lang === "en" ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          EN
        </Link>
        <Link
          href={getLangHref("az")}
          className={`rounded border px-3 py-1 text-sm ${
            lang === "az" ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          AZ
        </Link>
      </div>
      <p className="text-sm text-gray-700">{dict.common.locale}</p>
      <SignedOut>
        <SignInButton>
          <button className="mr-3 rounded-full border px-4 py-2 text-sm">
            {dict["Sign In"]}
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            {dict["Sign Up"]}
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
