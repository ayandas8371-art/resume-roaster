import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-bg-secondary border border-border shadow-2xl rounded-2xl",
              headerTitle: "text-text-primary",
              headerSubtitle: "text-text-secondary",
              socialButtonsBlockButton: "bg-bg-tertiary border-border text-text-primary hover:bg-border",
              formFieldInput: "bg-bg-tertiary border-border text-text-primary",
              formButtonPrimary: "bg-gradient-to-r from-accent-red to-accent-purple hover:opacity-90",
              footerActionLink: "text-accent-purple hover:text-accent-red",
            },
          }}
        />
      </div>
    </div>
  );
}
