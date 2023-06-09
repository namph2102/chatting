import "./loading.style.css";
const LoadingDot = () => {
  return (
    <div className="loading__chatting sm:min-h-[44px] min-h-[20px] flex items-center">
      <div className="box__container">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </div>
  );
};

export default LoadingDot;
