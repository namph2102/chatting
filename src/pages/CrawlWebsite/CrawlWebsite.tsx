import { useEffect } from "react";
import * as cheerio from "cheerio";
import axios from "axios";

const CrawlWebsite = () => {
  useEffect(() => {
    axios
      .get(
        "https://thanhnien.vn/nguyen-pho-thu-tuong-chinh-phu-vu-khoan-tu-tran-185230621095721972.htm"
      )
      .then((response) => {
        const $ = cheerio.load(response.data);
        const title = $("title").text();
        const image = $("meta[property='og:image']").attr("content");
        const description = $("meta[name='description']").attr("content");

        const reply =
          "https://thanhnien.vn/nguyen-pho-thu-tuong-chinh-phu-vu-khoan-tu-tran-185230621095721972.htm adasdsa tori72 ơi là trời";
        const regex = /https?:\/\/[^\s]+/g;
        const links = [...(reply.match(regex) || [])] || [];
        console.log(links);
        console.log(title);
        console.log(image);
        console.log(description);
      })

      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div>
      <section>hello</section>
    </div>
  );
};

export default CrawlWebsite;
