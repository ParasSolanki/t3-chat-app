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

function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

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

      <form
        className="flex flex-col space-y-4"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(handleSigninSubmit)}
      >
        {router.query.error && router.query.error === "CredentialsSignin" && (
          <small className="text-red-500">Invalid credentials</small>
        )}

        <div>
          <label htmlFor="email" className="font-medium text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={clsx(
              "mt-1 block w-full rounded-md border-2 border-neutral-700 bg-neutral-900 py-2 px-3 text-base text-slate-200 shadow-sm focus:bg-neutral-800/90 focus:outline-none focus:ring-0",
              {
                "focus-within:border-red-500": errors?.email?.message,
                "focus-within:border-orange-400": !errors?.email,
              }
            )}
            {...register("email")}
          />
          {errors?.email?.message ? (
            <small className="text-red-500">{errors.email.message}</small>
          ) : null}
        </div>
        <div>
          <label htmlFor="password" className="font-medium text-gray-300">
            Password
          </label>
          <div
            className={clsx(
              "relative mt-1 overflow-hidden rounded-md border-2 border-neutral-700 bg-neutral-900 text-slate-200 shadow-sm focus-within:bg-neutral-800/90 focus-within:outline-none focus-within:ring-0",
              {
                "focus-within:border-red-500": errors?.password?.message,
                "focus-within:border-orange-400": !errors?.password,
              }
            )}
          >
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="block w-full border-none bg-inherit pr-9 text-base"
              {...register("password")}
            />
            <button
              type="button"
              className="-z-1 absolute top-1/2 right-0 flex h-full w-9 -translate-y-1/2 items-center justify-center px-2 hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors?.password?.message ? (
            <small className="text-red-500">{errors.password.message}</small>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="highlight-white/20 relative block w-full rounded-lg bg-orange-400 px-4 py-2 text-lg font-semibold text-white shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:bg-orange-500/60 disabled:text-white/60"
        >
          <span className="absolute top-1/2 left-0 flex h-full w-10 -translate-y-1/2 items-center justify-center">
            <LockClosedIcon className="h-5 w-5 opacity-40" />
          </span>
          Signin
        </button>
      </form>

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
