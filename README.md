# StyleAI Frontend

Frontend React/Vite cho hệ thống StyleAI: quản lý workspace, tạo yêu cầu thiết kế thời trang bằng AI, xem kết quả generated designs, billing/credits và trang quản trị.

## Tech Stack

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- React Router 7
- Zustand
- Axios
- Lucide React

## Setup

```bash
npm install
```

Tạo file `.env`:

```bash
VITE_API_BASE_URL=https://pbl5-apiver1.onrender.com/api/v2
```

Nếu cần dùng mock service ở các feature có hỗ trợ mock:

```bash
VITE_USE_MOCK_DATA=true
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Architecture

- `src/features/*`: API service, mapper, type theo từng domain.
- `src/pages/*`: route-level UI cho user/admin/auth.
- `src/components/*`: component tái sử dụng.
- `src/hooks/*`: business logic và data-fetching hooks.
- `src/store/*`: Zustand store và React context.
- `src/services/ApiClient.ts`: Axios client dùng chung, gắn token và xử lý lỗi auth.

## Main Routes

- `/login`: đăng nhập/đăng ký.
- `/workspace`: danh sách project.
- `/workspace/:projectId`: chi tiết project và request history.
- `/create-design`: cấu hình tạo thiết kế.
- `/design-studio`: xem kết quả thiết kế.
- `/billing`: billing và plans.
- `/admin`: dashboard admin.
- `/admin/users`: quản lý người dùng.
- `/admin/credit-logs`: log credit.
- `/admin/settings`: cấu hình hệ thống.

## Current Verification

Đã kiểm tra:

```bash
npm run build
npm run lint
```

Build production và lint đều đã pass, không còn warning.
