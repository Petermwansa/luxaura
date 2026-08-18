import { SignIn } from "@clerk/nextjs";

import { AuthLayout } from "@/components/auth/AuthLayout";

export default function SignInPage() {
  return (
    <AuthLayout
      title={
        <>
          Welcome
          <br />
          <i>back home.</i>
        </>
      }
      description="Sign in to save your favourite properties, manage your enquiries and discover exceptional places."
    >
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#000000",
            colorForeground: "#111111",
            colorBackground: "#f7f6f2",
            colorInputBackground: "#ffffff",
            colorInputText: "#111111",
            borderRadius: "0.75rem",
          },

          elements: {
            rootBox: "w-full",
            cardBox: "w-full",
            card: "w-full border-0 bg-transparent p-0 shadow-none",
            headerTitle:
              "font-display text-4xl font-normal text-black",
            headerSubtitle:
              "mt-2 text-sm leading-6 text-black/50",
            socialButtonsBlockButton:
              "h-12 rounded-xl border border-black/10 bg-white text-sm font-medium shadow-none transition hover:bg-black hover:text-white",
            socialButtonsBlockButtonText:
              "font-medium",
            dividerLine:
              "bg-black/10",
            dividerText:
              "text-xs text-black/40",
            formFieldLabel:
              "text-xs font-medium text-black",
            formFieldInput:
              "h-12 rounded-xl border border-black/10 bg-white text-sm shadow-none outline-none focus:border-black",
            formButtonPrimary:
              "h-12 rounded-xl bg-black text-sm font-medium shadow-none transition hover:bg-black/80",
            footerActionText:
              "text-sm text-black/50",
            footerActionLink:
              "font-medium text-black hover:text-black/60",
            identityPreviewEditButton:
              "text-black",
            formResendCodeLink:
              "text-black",
            alertText:
              "text-sm",
          },

          options: {
            socialButtonsPlacement: "top",
            socialButtonsVariant: "blockButton",
          },
        }}
      />
    </AuthLayout>
  );
}