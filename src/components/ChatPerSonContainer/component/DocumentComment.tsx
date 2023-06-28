import { FC } from "react";
import { BiDownload, BiLinkAlt } from "react-icons/bi";
import { handleCoverSize } from "../util";
interface DocumentCommentProps {
  fileName: string;
  path: string;
  size: number;
  url: string;
}
const DocumentComment: FC<DocumentCommentProps> = (props) => {
  return (
    <div className="flex p-4 m-2 gap-2 items-center border-primary_style-document  rounded-lg">
      <a
        href={props.url}
        rel="noopener noreferrer"
        download={props.fileName}
        className="text-2xl background-primary p-2 rounded-full opacity-70"
      >
        <BiLinkAlt />
      </a>
      <div className="text-sm">
        <p className="text-sm  text-style__ellipsis sm:max-w-[300px]  md:max-w-[230px] max-w-[120px]">
          {props.fileName}
        </p>
        <p className="text-xs font-light">{handleCoverSize(props.size)}</p>
      </div>
      <a
        href={props.url}
        download={props.fileName}
        className="animate-bounce cursor-pointer text-2xl "
        rel="noopener noreferrer"
      >
        <BiDownload />
      </a>
    </div>
  );
};

export default DocumentComment;
