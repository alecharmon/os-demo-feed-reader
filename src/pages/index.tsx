import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import AuthLoginLogOut from "~/componets/AuthLoginLogOut";
import { useRouter } from "next/navigation";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  if (sessionData?.user) {
    router.push("/home");
  }
  return (
    <>
      <Head>
        <title>Alec`s Feed Reader</title>
        <meta name="description" content="Alec's Feed Reader" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">RSS</span> Reader
          </h1>
          <div className="grid ">
            <h2 className="text-lg text-white">
              Get Rss Notifications for your Feed Reader
            </h2>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AuthLoginLogOut />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
