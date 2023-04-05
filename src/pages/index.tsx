import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User as UserIcon, PlusIcon, InfoIcon } from "lucide-react";
import * as DropdownMenu from "~/components/ui/DropdownMenu";
import * as Dialog from "~/components/ui/Dialog";
import Form from "~/components/forms/Form";
import Input from "~/components/forms/Input";
import SubmitButton from "~/components/forms/SubmitButton";
import useZodForm from "~/hooks/use-zod-form";
import { api } from "~/utils/api";
import { createChannelSchema } from "~/common/validations/channel";
import { useState } from "react";

function User() {
  const { data } = useSession();
  const splitedName = data?.user.name?.split(" ");

  const firstInitial =
    splitedName !== undefined && splitedName[0] ? splitedName[0].charAt(0) : "";
  const secondInitial =
    splitedName !== undefined && splitedName[1] ? splitedName[1].charAt(0) : "";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="focus flex h-7 w-7 items-center justify-center rounded-md bg-zinc-700 outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-zinc-950">
        <strong className="text-xs uppercase tracking-widest">
          {`${firstInitial}${secondInitial}`}
        </strong>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" className="w-48 rounded-md p-3">
        <div className="mb-3 flex items-start space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-700">
            <strong className="text-sm uppercase tracking-widest">
              {`${firstInitial}${secondInitial}`}
            </strong>
          </div>
          <div className="grow-1 leading-tight">
            <p className="text-sm font-semibold text-white">
              {data?.user.name}
            </p>
            <span className="text-xs text-zinc-400">
              @{data?.user.username}
            </span>
          </div>
        </div>
        <DropdownMenu.Item className="inline-flex w-full cursor-pointer items-center rounded-md p-2">
          <UserIcon className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="my-1.5" />
        <DropdownMenu.Item asChild className="rounded-md p-2">
          <button
            type="button"
            className="inline-flex w-full cursor-pointer items-center text-red-500"
            onClick={() => void signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function Header() {
  return (
    <header className="sticky inset-x-0 top-0 z-30 flex h-11 items-center justify-between bg-zinc-950/70 px-2 py-1.5">
      <div className=""></div>
      <User />
    </header>
  );
}

function DangerAlert({ message }: { message: string }) {
  return (
    <div
      className="mb-4 flex items-center rounded-lg border border-red-500 bg-red-500/50 p-4 text-sm text-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400"
      role="alert"
    >
      <InfoIcon className="mr-2 h-4 w-4 flex-shrink-0" />
      <span className="sr-only">Info</span>
      <p className="font-medium">{message}</p>
    </div>
  );
}

function CreateChannelForm(props: { onSuccess: () => void }) {
  const utils = api.useContext();
  const [message, setMessage] = useState("");
  const { mutate, isError } = api.channel.create.useMutation({
    onError({ message }) {
      setMessage(message);
    },
    async onSuccess() {
      props.onSuccess();
      await utils.channel.getAll.invalidate();
    },
  });
  const form = useZodForm({
    schema: createChannelSchema,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <Form form={form} onSubmit={(data) => mutate(data)}>
      {isError && <DangerAlert message={message} />}
      <div className="space-y-4">
        <Input label="Name" {...form.register("name")} />
        <Input
          label="Description (optional)"
          {...form.register("description")}
        />

        <div className="flex justify-end">
          <SubmitButton disabled={form.formState.isSubmitting}>
            Save
          </SubmitButton>
        </div>
      </div>
    </Form>
  );
}

function CreateChannelDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-700 shadow-md outline-none hover:bg-zinc-600 focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-800"
        >
          <PlusIcon className="h-4 w-4" size={12} />
        </button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header className="text-2xl font-semibold">
          Create Channel
        </Dialog.Header>
        <CreateChannelForm onSuccess={() => setOpen(false)} />
      </Dialog.Content>
    </Dialog.Root>
  );
}

function ChannelListSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {new Array(5).fill(0).map((_, index) => (
        <div key={index} className="h-7 w-full rounded-md bg-zinc-700/70"></div>
      ))}
    </div>
  );
}

function ChannelsList() {
  const { isLoading, data: channels } = api.channel.getAll.useQuery();

  return (
    <div className="px-4">
      <div className="flex justify-between">
        <strong className="text-lg">Channels</strong>
        <CreateChannelDialog />
      </div>
      <div className="mt-2">
        {isLoading && <ChannelListSkeleton />}
        {!isLoading && !!channels?.length && (
          <ul className="space-y-1">
            {channels.map((channel) => (
              <li key={channel.id}>
                <Link
                  className="block rounded-md p-1 px-2 hover:bg-zinc-600"
                  href={{
                    pathname: "/channel/[id]",
                    query: { id: channel.id },
                  }}
                >
                  {channel.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sticky left-0 top-11 z-20 flex h-full max-h-full flex-col justify-between overflow-y-auto bg-zinc-800">
      <div className="py-3">
        <ChannelsList />
      </div>
    </aside>
  );
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-full max-h-screen overflow-hidden">
        <Header />
        <div className="grid grid-cols-[16rem_1fr] grid-rows-1">
          <Sidebar />

          <div className="h-full p-2">
            <div className="max-h-[30rem] overflow-y-auto ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
              aliquam dolore sint aperiam id obcaecati consectetur. Dolore
              veritatis excepturi nisi impedit iure dignissimos possimus soluta
              quod, sequi voluptatum, ex adipisci? Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Enim, aliquam dolore sint aperiam id
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
              aliquam dolore sint aperiam id obcaecati consectetur. Dolore
              veritatis excepturi nisi impedit iure dignissimos possimus soluta
              quod, sequi voluptatum, ex adipisci? Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Enim, aliquam dolore sint aperiam id
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
              aliquam dolore sint aperiam id obcaecati consectetur. Dolore
              veritatis excepturi nisi impedit iure dignissimos possimus soluta
              quod, sequi voluptatum, ex adipisci? Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Enim, aliquam dolore sint aperiam id
              obcaecati consectetur. Dolore veritatis excepturi nisi impedit
              iure dignissimos possimus soluta quod, sequi voluptatum, ex
              adipisci? Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Enim, aliquam dolore sint aperiam id obcaecati consectetur. Dolore
              veritatis excepturi nisi impedit iure dignissimos possimus soluta
              quod, sequi voluptatum, ex adipisci? Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Enim, aliquam dolore sint aperiam id
              obcaecati consectetur. Dolore veritatis excepturi nisi impedit
              iure dignissimos possimus soluta quod, sequi voluptatum, ex
              adipisci? veritatis excepturi nisi impedit iure dignissimos
              possimus soluta quod, sequi voluptatum, ex adipisci? Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Enim, aliquam dolore
              sint aperiam id obcaecati consectetur. Dolore veritatis excepturi
              nisi impedit iure dignissimos possimus soluta quod, sequi
              voluptatum, ex adipisci? veritatis excepturi nisi impedit iure
              dignissimos possimus soluta quod, sequi voluptatum, ex adipisci?
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
              aliquam dolore sint aperiam id obcaecati consectetur. Dolore
              veritatis excepturi nisi impedit iure dignissimos possimus soluta
              quod, sequi voluptatum, ex adipisci? veritatis excepturi nisi
              impedit iure dignissimos possimus soluta quod, sequi voluptatum,
              ex adipisci? Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Enim, aliquam dolore sint aperiam id obcaecati consectetur.
              Dolore veritatis excepturi nisi impedit iure dignissimos possimus
              soluta quod, sequi voluptatum, ex adipisci? veritatis excepturi
              nisi impedit iure dignissimos possimus soluta quod, sequi
              voluptatum, ex adipisci? Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Enim, aliquam dolore sint aperiam id obcaecati
              consectetur. Dolore veritatis excepturi nisi impedit iure
              dignissimos possimus soluta quod, sequi voluptatum, ex adipisci?
              veritatis excepturi nisi impedit iure dignissimos possimus soluta
              quod, sequi voluptatum, ex adipisci? Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Enim, aliquam dolore sint aperiam id
              obcaecati consectetur. Dolore veritatis excepturi nisi impedit
              iure dignissimos possimus soluta quod, sequi voluptatum, ex
              adipisci?
            </div>

            <div className="">Chat box</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
