import React, { useEffect } from "react";

export default function VideoDemoModal({
  open,
  onClose,
  // Dùng 1 trong 2: youtubeUrl HOẶC mp4Src
//   youtubeUrl, // ví dụ: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  mp4Src,     // ví dụ: "/videos/healthconnect-demo.mp4"
  autoPlay = true,
}) {
  // Đóng bằng phím ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Khóa scroll nền khi mở modal
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  // Thêm autoplay cho YouTube nếu cần
  // const ytSrc = youtubeUrl
  //   ? youtubeUrl + (youtubeUrl.includes("?") ? "&" : "?") + (autoPlay ? "autoplay=1" : "")
  //   : null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-3 top-3 rounded-full bg-black/70 text-white px-2 py-1 text-sm hover:bg-black/85"
        >
          ✕
        </button>

        {/* Khung video tỉ lệ 16:9 */}
        <div className="relative w-full aspect-video bg-black">
          {/* {ytSrc && (
            <iframe
              key={ytSrc} // unmount/mount lại để reset khi đóng/mở
              src={ytSrc}
              title="Video demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          )} */}

          {mp4Src && (
            <video
              key={mp4Src}
              src={mp4Src}
              className="absolute inset-0 h-full w-full"
              controls
              autoPlay={autoPlay}
            />
          )}
        </div>
      </div>
    </div>
  );
}
