/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { NextApiRequest, NextApiResponse } from "next";
import * as OneSignal from "@onesignal/node-onesignal";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import Parser from "rss-parser";

let onesignalClient: OneSignal.DefaultApi | undefined;

const getOneSignalClient = () => {
  if (!onesignalClient) {
    const configuration = OneSignal.createConfiguration({
      authMethods: {
        app_key: {
          tokenProvider: {
            getToken() {
              return env.ONESIGNAL_REST_KEY;
            },
          },
        },
      },
    });

    onesignalClient = new OneSignal.DefaultApi(configuration);
  }
  return onesignalClient;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parser = new Parser();

  const users = await prisma.user.findMany({
    include: {
      feeds: true,
    },
  });
  for (const u of users) {
    for (const f of u.feeds) {
      try {
        const parsedFeed = await parser.parseURL(f.url);

        parsedFeed.items.sort((a, b) => {
          const aDate = a?.isoDate ?? "";
          const bDate = b?.isoDate ?? "";
          return aDate > bDate ? -1 : aDate > bDate ? 0 : 1;
        });

        console.log(parsedFeed.items.map((i) => i.isoDate));

        const latestPost = parsedFeed.items[0];
        const latestPostDate = latestPost?.isoDate ?? undefined;
        if (!latestPostDate) {
          throw new Error(
            `no date found for ${parsedFeed.feedUrl ?? "feed url not found"}}`
          );
        }

        const latestNotification = f?.notifiedAt ?? new Date(0);
        if (latestNotification < new Date(latestPostDate)) {
          console.log("sending notificiation for", latestPost);
          await getOneSignalClient().createNotification({
            app_id: env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
            contents: {
              en: `${parsedFeed.title ?? "Feed"}: ${
                latestPost?.title ?? "title"
              } `,
            },
            include_external_user_ids: [u.id],
          });
          await prisma.rssFeed.update({
            where: {
              id: f.id,
            },
            data: {
              ...f,
              notifiedAt: new Date(),
            },
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  res.status(200);
}
