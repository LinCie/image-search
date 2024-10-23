import { Elysia } from "elysia";
import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";

const app = new Elysia()
  .get("/", () => "Hello Bun!")
  .get("/search", async ({ query: { q, offset } }) => {
    const customsearch = google.customsearch("v1");
    const apikey = Bun.env.APIKEY;

    const results = await customsearch.cse.list({
      cx: "2083d6ff215544e68",
      q: q || "banana",
      auth: apikey,
      searchType: "image",
      start: Number(offset) || 0,
    });

    const searchList = results.data.items;
    const displayItems = searchList?.map((item) => {
      let itemDetails = {
        id: uuidv4(),
        url: item.link,
        original: item.link,
        snippet: item.snippet,
        thumbnail: item?.image?.thumbnailLink,
        context: item?.image?.contextLink,
      };
      return itemDetails;
    });
    return displayItems;
  })
  .listen(Bun.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export { app };
