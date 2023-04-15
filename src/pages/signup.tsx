import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { signIn } from "next-auth/react";
import { api } from "~/utils/api";
import useZodForm from "~/hooks/use-zod-form";
import { signupSchema } from "~/common/validations/auth";
import AuthLayout from "~/components/AuthLayout";
import Form from "~/components/forms/Form";
import Input from "~/components/forms/Input";
import { Button } from "~/components/ui/Button";
import type { z } from "zod";

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync } = api.auth.signup.useMutation();
  const form = useZodForm({
    schema: signupSchema,
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function handleSigninSubmit(data: z.infer<typeof signupSchema>) {
    try {
      const { ok } = await mutateAsync(data);

      if (ok) {
        await signIn("credentials", { ...data, callbackUrl: "/" });
      }
    } catch (error) {
      // TODO: add proper error handling
      console.log(error);
    }
  }

  useEffect(() => {
    form.setFocus("name");
  }, [form]);

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col">
      <h2 className="mb-4 text-4xl font-bold text-white">Signup new account</h2>

      <Form form={form} onSubmit={handleSigninSubmit}>
        <div className="space-y-4">
          <Input label="Name" {...form.register("name")} />
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
          <Button
            type="submit"
            size="lg"
            className="relative w-full text-lg"
            disabled={form.formState.isSubmitting}
          >
            <span className="absolute left-0 top-1/2 flex h-full w-10 -translate-y-1/2 items-center justify-center">
              <LockClosedIcon className="h-5 w-5 opacity-40" />
            </span>
            Signup
          </Button>
        </div>
      </Form>

      <p className="mt-4 text-base text-gray-300">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-orange-400 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SigninPage() {
  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>

      <AuthLayout>
        <SignupForm />
      </AuthLayout>
    </>
  );
}
