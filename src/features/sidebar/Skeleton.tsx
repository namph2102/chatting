import { Skeleton } from "@mui/material";
const SkeletonLayout = () => {
  return (
    <div className="px-4 flex flex-col flex-wrap gap-2 mb-2">
      <Skeleton
        variant="text"
        animation="wave"
        className="skeleton--effect w-12"
        sx={{ fontSize: "1rem" }}
      />
      <article className="flex gap-2 items-center">
        <Skeleton
          variant="circular"
          animation="wave"
          className="skeleton--effect"
          width={30}
          height={25}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          className="w-full skeleton--effect rounded-xl"
          height={20}
        />
      </article>
      <article className="flex gap-2 items-center">
        <Skeleton
          variant="circular"
          animation="wave"
          className=" skeleton--effect"
          width={30}
          height={25}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          className="w-full skeleton--effect rounded-xl"
          height={20}
        />
      </article>
      <article className="flex gap-2 items-center">
        <Skeleton
          variant="circular"
          animation="wave"
          className=" skeleton--effect"
          width={30}
          height={25}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          className="w-full skeleton--effect rounded-xl"
          height={20}
        />
      </article>
    </div>
  );
};

export default SkeletonLayout;
