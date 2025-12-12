const BackgroundVideo = () => {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        className="fixed inset-0 w-full h-full min-h-screen -z-10"
        style={{
          objectFit: "cover",
          objectPosition: "center 70%"
        }}
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay" />
    </>
  );
};

export default BackgroundVideo;
