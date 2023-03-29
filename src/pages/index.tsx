import { type NextPage } from "next";
import Head from "next/head";

import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

function User() {
  const { data } = useSession();
  return (
    <div className="flex items-center justify-between space-x-3 bg-black/70 p-4 shadow-md">
      <div className="flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-700">
          <strong>{data?.user.name?.charAt(0)}</strong>
        </div>
        <strong className="growo-1 text-base">{data?.user.name}</strong>
      </div>
      <button
        type="button"
        title="Logout"
        className="text-2xl"
        onClick={() => void signOut()}
      >
        &rarr;
      </button>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col justify-between bg-zinc-800">
      <div className="py-3">
        <div className="flex justify-between px-4">
          <strong className="text-lg">Channels</strong>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-700 shadow"
          >
            +
          </button>
        </div>
      </div>

      <User />
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
      <Sidebar />
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
