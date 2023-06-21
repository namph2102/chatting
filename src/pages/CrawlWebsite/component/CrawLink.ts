import axios from "axios";
import * as cheerio from "cheerio";
const regex = /https?:\/\/[^\s]+/g;
export const crawLinkChating = (comment: string) => {
  const link = [...(comment.match(regex) || [])][0] || "";
  const message = link ? comment.replace(link, " ") : "";
  return axios.get(link).then((response) => {
    const $ = cheerio.load(response.data);
    const title = $("title").text() || "";
    const image = $("meta[property='og:image']").attr("content") || "";
    const description = $("meta[name='description']").attr("content") || "";
    // const info = {
    //   message,
    //   title,
    //   description,
    //   image,
    // };
    return title + "*" + description + "*" + image + "*" + link + "*" + message;
  });
};
