import { FC } from "react";

import { Skeleton } from "@mui/material";
interface LinkCommentItemProps {
  comment: string;
  className?: string;
}

const LinkCommentItem: FC<LinkCommentItemProps> = ({
  comment,
  className = "sm:w-80  w-40 block",
}) => {
  const [
    title,
    description = "Nội dung lỗi",
    image,
    link = "https://zecky.online/",
    message = "",
  ] = comment.split("*");
  return (
    <>
      {message && (
        <p
          className="font_inter-chatting font-light break-all py-2"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {title && (
        <div className={className}>
          <h6 className=" flex justify-center py-2 px-3 border-t-gray-300 border rounded-t-3xl text-sm opacity-80 hover:text-blue-400 font-light capitalize">
            <a href={link} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          </h6>

          <div className="bg-[url(`${}`)"></div>
          {image && (
            <img
              className="w-full h-full opacity-60"
              src={image}
              alt="ảnh lỗi"
            />
          )}

          <p className=" line-clamp-2 text-sm font-light indent-3.5 mt-1 ">
            {description}
          </p>
        </div>
      )}
      {!title && (
        <div>
          <Skeleton variant="text" width={80} sx={{ fontSize: "1rem" }} />
          <Skeleton variant="rectangular" width={320} height={160} />
          <Skeleton variant="text" width={320} sx={{ fontSize: "0.875rem" }} />
          <Skeleton variant="text" width={320} sx={{ fontSize: "0.875rem" }} />
        </div>
      )}
    </>
  );
};

export default LinkCommentItem;
