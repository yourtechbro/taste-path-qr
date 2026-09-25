import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, LoaderCircle, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MenuCard" },
      {
        name: "description",
        content: "Sign in to manage your restaurant menu, categories and QR code.",
      },
      { property: "og:title", content: "Sign in — MenuCard" },
      {
        property: "og:description",
        content: "Sign in to manage your restaurant menu, categories and QR code.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/" });
  }, [loading, session, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setCheckEmail(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-8 sm:px-8">
      <div className="w-full max-w-[376px]">
        <header className="auth-enter mb-6 text-center sm:mb-8">
          <div className="auth-mark-enter mx-auto mb-3 grid size-14 -rotate-2 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-auth-button sm:mb-4">
            <UtensilsCrossed className="size-6" strokeWidth={1.8} />
          </div>
          <p className="font-display text-2xl font-semibold">MenuCard</p>
          <p className="mt-1 text-sm text-muted-foreground">Your menu, ready for every table.</p>
        </header>

        {checkEmail ? (
          <section className="auth-enter auth-delay-1 rounded-2xl border border-border/70 bg-card p-7 text-center shadow-auth">
            <div className="mx-auto mb-4 grid size-11 place-items-center rounded-full bg-sage/15 text-sage">
              <Check className="size-5" />
            </div>
            <h1 className="font-display text-2xl font-semibold">Check your email</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We sent a confirmation link to {email}. Click it to finish signing up.
            </p>
          </section>
        ) : (
          <>
            <section className="auth-enter auth-delay-1 rounded-2xl border border-border/70 bg-card p-6 shadow-auth sm:p-8">
              <div className="mb-6">
                <h1 className="font-display text-2xl font-semibold">
                  {mode === "signin" ? "Welcome back" : "Create your account"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mode === "signin"
                    ? "Sign in to manage your digital menu."
                    : "Start building your restaurant menu."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="ml-0.5 text-xs text-muted-foreground">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@restaurant.com"
                    className="h-12 rounded-xl bg-secondary/45 px-4 shadow-none transition-[background-color,border-color,box-shadow] duration-300 focus-visible:bg-card focus-visible:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="ml-0.5 text-xs text-muted-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    className="h-12 rounded-xl bg-secondary/45 px-4 shadow-none transition-[background-color,border-color,box-shadow] duration-300 focus-visible:bg-card focus-visible:ring-2"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={busy}
                  className="group mt-1 h-12 w-full rounded-xl shadow-auth-button transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  {busy ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Please wait…
                    </>
                  ) : (
                    <>
                      {mode === "signin" ? "Sign in" : "Create account"}
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3 text-[11px] font-medium uppercase text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or continue with
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogle}
                className="h-12 w-full rounded-xl bg-card shadow-none transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-secondary active:translate-y-0 active:scale-[0.98]"
              >
                <span className="grid size-5 place-items-center rounded-full border border-border font-semibold">
                  G
                </span>
                Continue with Google
              </Button>
            </section>

            <Button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              variant="link"
              className="auth-enter auth-delay-2 mt-4 h-auto w-full text-sm text-muted-foreground"
            >
              {mode === "signin"
                ? "New here? Create an account"
                : "Already have an account? Sign in"}
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
