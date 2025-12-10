const BackgroundVideo = () => {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-background"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay" />
    </>
  );
};

export default BackgroundVideo;
