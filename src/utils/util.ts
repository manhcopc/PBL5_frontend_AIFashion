// Hàm biến đổi URL ngrok thành URL chạy qua proxy
export const transformToProxyUrl = (originalUrl: string): string => {
  if (!originalUrl) return "";

  try {
    // Dùng đối tượng URL có sẵn của JavaScript để bóc tách đường dẫn
    const urlObj = new URL(originalUrl);

    // urlObj.pathname sẽ lấy ra đúng đoạn "/outputs/design_83660633.png"
    return `/ngrok-proxy${urlObj.pathname}`;
  } catch {
    // Nếu dữ liệu bị lỗi không phải là dạng link URL, trả về nguyên bản
    return originalUrl;
  }
};
