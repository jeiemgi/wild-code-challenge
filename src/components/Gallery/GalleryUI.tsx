function GalleryUI() {
  return (
    <div
      className={
        "fixed left-10 top-10 z-10 overflow-hidden rounded-md bg-white/50 shadow-2xl backdrop-blur-3xl"
      }
    >
      <button
        id={"button-prev"}
        className={
          "border-r border-white/30 p-5 font-bold hover:bg-black hover:text-white active:bg-black active:text-white"
        }
      >
        Prev
      </button>
      <button
        id={"button-next"}
        className={
          "p-5 font-bold hover:bg-black hover:text-white active:bg-black active:text-white"
        }
      >
        Next
      </button>
    </div>
  );
}

export default GalleryUI;
