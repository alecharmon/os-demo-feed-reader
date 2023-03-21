"use client";

import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OneSignalReact from "react-onesignal";
import AuthLoginLogOut from "~/componets/AuthLoginLogOut";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionData?.user == undefined) {
      router.push("/");
    }
  }, [router, sessionData]);

  OneSignalReact.showSlidedownPrompt({ force: true }).catch((e) => {
    console.log(e);
  });

  useEffect(() => {
    OneSignalReact.setExternalUserId(sessionData?.user.id).catch((e) =>
      console.log(e)
    );
  }, []);

  const [newRss, setNewRss] = useState<string>("");
  const createFeedMutation = api.rssFeed.create.useMutation({
    onSuccess: async () => {
      await allFeedsData.refetch();
    },
  });
  const allFeedsData = api.rssFeed.getAll.useQuery();

  const handleCreate = () => {
    debugger;
    createFeedMutation.mutate({ url: newRss });
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] pt-8">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Welcome {sessionData?.user.name}!
          </h1>
          <div className="grid ">
            <h2 className="text-lg text-white">
              Get Rss Notifications for your Feed Reader
            </h2>
            <div className="flex py-8">
              <input
                type="text"
                className="input-bordered input w-full max-w-xs"
                placeholder={"Add a new RSS feed here"}
                onChange={(e) => {
                  e.preventDefault();
                  setNewRss(e.target.value);
                }}
                value={newRss}
              />
              <button
                onClick={handleCreate}
                className="btn-primary btn-active btn"
              >
                Add
              </button>
            </div>
          </div>
          <div>
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Url</th>
                  <th>created at</th>
                  <th>last updated at</th>
                  <th>last notified at</th>
                </tr>
              </thead>
              <tbody>
                {allFeedsData.data?.map((usersFeed, index) => {
                  return (
                    <tr key={usersFeed.id}>
                      <th>{index + 1}</th>
                      <td>{usersFeed.url}</td>
                      <td>{usersFeed.createdAt.toLocaleString()}</td>
                      <td>{usersFeed.updatedAt.toLocaleString()}</td>
                      <td>
                        {usersFeed.notifiedAt?.toLocaleString() ?? "never"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
