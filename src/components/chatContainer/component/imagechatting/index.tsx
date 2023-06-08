/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FC } from "react";
interface ImageChatCommentProps {
  listImage: { url: string; id: string }[];
}
const ImageChatComment: FC<ImageChatCommentProps> = ({ listImage }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {listImage.length > 0 &&
        listImage.map((img) => (
          <a key={img.id} target="_blank" className="block" href={img.url}>
            <LazyLoadImage
              alt={img.id}
              effect="blur"
              visibleByDefault={img.url}
              src={img.url}
            />
          </a>
        ))}
    </section>
  );
};

export default ImageChatComment;
