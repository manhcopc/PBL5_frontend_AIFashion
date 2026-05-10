import { useState, useEffect } from "react";

interface NgrokImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function NgrokImage({ src, alt, className }: NgrokImageProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Nếu không có link thì bỏ qua
    if (!src) return;

    const fetchImage = async () => {
      try {
        const response = await fetch(src, {
          method: "GET",
          headers: {
            // ✅ ĐÂY LÀ CHÌA KHÓA: Báo cho Ngrok biết đừng hiện trang cảnh báo
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        // Biến cục data tải về thành file nhị phân (Blob)
        const blob = await response.blob();

        // Tạo ra một đường link ảo (rất ngắn) trên bộ nhớ của React
        // Ví dụ: blob:http://localhost:5173/a1b2c3d4...
        const localUrl = URL.createObjectURL(blob);
        setObjectUrl(localUrl);
      } catch (error) {
        console.error("Lỗi tải ảnh qua fetch:", error);
        setHasError(true);
      }
    };

    fetchImage();

    // Dọn dẹp bộ nhớ khi component bị hủy
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  // Nếu đang tải
  if (!objectUrl && !hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-800 animate-pulse ${className}`}
      >
        <span className="text-zinc-500 text-sm">Đang tải ảnh...</span>
      </div>
    );
  }

  // Nếu tải lỗi, hiện ảnh dự phòng
  if (hasError) {
    return (
      <img
        src="https://placehold.co/400x600/18181b/a1a1aa?text=Loi+Hinh+Anh"
        alt="Lỗi"
        className={className}
      />
    );
  }

  // Khi tải xong, hiển thị ảnh bằng link ảo
  return <img src={objectUrl} alt={alt} className={className} />;
}
