import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f6f2] p-6">
      <SignIn
        appearance={{
          elements: {
            card: "shadow-xl shadow-black/5",
          },
        }}
      />
    </main>
  );
}