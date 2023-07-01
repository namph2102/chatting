import axios from "axios";
import * as cheerio from "cheerio";

import instance from "../../../config";
const regex = /https?:\/\/[^\s]+/g;
export const crawLinkChating = (comment: string) => {
  const link = [...(comment.match(regex) || [])][0] || "";
  const message = link ? comment.replace(link, " ") : "";
  return instance
    .post("user/crawlink", {
      data: link,
    })
    .then((res) => res.data)
    .then((res) => {
      return res.link + message;
    })
    .catch(() => {
      return axios
        .get(link)
        .then((res) => res.data)
        .then((data) => {
          const $ = cheerio.load(data);
          const title = $("title").text() || "";
          const image = $("meta[property='og:image']").attr("content") || "";
          const description =
            $("meta[name='description']").attr("content") || "";
          if (!title) throw new Error("Không lấy được");
          return (
            title + "*" + description + "*" + image + "*" + link + "*" + message
          );
        })
        .catch(() => comment);
    });
};
