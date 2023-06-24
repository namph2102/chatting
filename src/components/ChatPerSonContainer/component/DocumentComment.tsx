import { FC } from "react";
import { BiDownload, BiLinkAlt } from "react-icons/bi";
interface DocumentCommentProps {
  fileName: string;
  path: string;
  size: number;
  url: string;
}
const DocumentComment: FC<DocumentCommentProps> = (props) => {
  const coverSize =
    props.size > 1024
      ? (props.size / 1024).toFixed(2) + " MB"
      : props.size.toFixed(2) + " KB";
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
        <p className="text-sm line-clamp-1">{props.fileName}</p>
        <p className="text-xs font-light">{coverSize}</p>
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
