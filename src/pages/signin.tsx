import Head from "next/head";
import Link from "next/link";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import AuthLayout from "~/components/AuthLayout";
import { signinSchema } from "~/common/validations/auth";
import type { z } from "zod";
import useZodForm from "~/hooks/use-zod-form";
import Form from "~/components/forms/Form";
import Input from "~/components/forms/Input";
import { Button } from "~/components/ui/Button";

function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useZodForm({
    schema: signinSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    form.setFocus("email");
  }, [form]);

  async function handleSigninSubmit(data: z.infer<typeof signinSchema>) {
    try {
      await signIn("credentials", {
        ...data,
        callbackUrl: "/",
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col">
      <h2 className="mb-4 text-4xl font-bold text-white">
        Signin to your account
      </h2>

      {router.query.error && router.query.error === "CredentialsSignin" && (
        <small className="text-red-500">Invalid credentials</small>
      )}

      <Form form={form} onSubmit={handleSigninSubmit}>
        <div className="space-y-4">
          <Input label="Email" {...form.register("email")} />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            className="pr-10"
            {...form.register("password")}
            appendicon={
              <button
                type="button"
                className="-z-1 absolute right-0 top-1/2 flex h-full w-9 -translate-y-1/2 items-center justify-center px-2 hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            }
          />

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="highlight-white/20 relative block w-full rounded-lg bg-orange-400 px-4 py-2 text-lg font-semibold text-white shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:bg-orange-500/60 disabled:text-white/60"
          >
            <span className="absolute left-0 top-1/2 flex h-full w-10 -translate-y-1/2 items-center justify-center">
              <LockClosedIcon className="h-5 w-5 opacity-40" />
            </span>
            Signin
          </button>
        </div>
      </Form>

      <p className="mt-4 text-base text-gray-300">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/signup"
          className="font-medium text-orange-400 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function SigninPage() {
  return (
    <>
      <Head>
        <title>Signin</title>
      </Head>
      <AuthLayout>
        <SigninForm />
      </AuthLayout>
    </>
  );
}
