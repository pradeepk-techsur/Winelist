"use client";
import { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => loginAction(formData),
    null
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0605] p-6">
      <Card className="w-full max-w-sm bg-[#1a0a0a] border-white/10">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🍷</div>
          <CardTitle className="text-white text-xl">Wine Cellar</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/80">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
              />
            </div>
            {state?.error && (
              <p className="text-red-400 text-sm">{state.error}</p>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#8B1A1A] hover:bg-[#A52020] text-white"
            >
              {isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
