import { useEffect, useState } from "react";
import * as cheerio from "cheerio";
import axios from "axios";

const CrawlWebsite = () => {
  const [listcontent, setListContent] = useState<string[]>([]);
  const [h1Tag, setH1Tag] = useState<string>("");
  useEffect(() => {
    axios
      .get("https://nettruyen.net.vn/truyen/tuyet-the-chien-hon-7223/")
      .then((response) => {
        const $ = cheerio.load(response.data);

        const h1text = $("h1").text();
        const listString: string[] = [];
        $(".container .ModuleContent .image img").each((i, el) => {
          console.log(el, i);
          const pElement = "https://nettruyen.net.vn/" + $(el).attr("src");

          if (pElement) {
            listString.push(pElement);
          }

          console.log("--------------------------");
          // Duyệt qua tất cả các phần tử có class là "article"
        });
        setListContent([...listString]);
        setH1Tag(h1text);
      })

      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div>
      <h1>{h1Tag}</h1>
      <section>
        {listcontent.length > 0 &&
          listcontent.map((p, index) => (
            <p key={index}>
              {" "}
              <img src={p} alt="" />
            </p>
          ))}
      </section>
    </div>
  );
};

export default CrawlWebsite;
