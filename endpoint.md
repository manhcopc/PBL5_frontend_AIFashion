

**1. Dashboard Stats**

```http
GET /admin/stats
```

Dùng cho trang `AdminDashboard`.

Response nên là:

```ts
{
  totalUsers: number;
  userGrowth: number;
  totalCreditsSold: number;
  successRate: number;
  activeGenerations: number;
}
```

Chức năng:
- Tổng số user.
- Tăng trưởng user theo tháng.
- Tổng credit đã bán/nạp.
- Tỉ lệ generation thành công.
- Số generation đang chạy.

**2. User Management**

```http
GET /admin/users?page=1&limit=10&email=&plan=
```

Response:

```ts
{
  users: {
    _id: string;
    email: string;
    username: string;
    available_credits: number;
    created_at: string;
    role: "User" | "Admin";
    createdAt?: string;
    lastActive?: string;
  }[];
  total: number;
}
```

Chức năng:
- Lấy danh sách user.
- Hỗ trợ phân trang.
- Hỗ trợ search theo email.
- Nếu sau này dùng plan thì hỗ trợ filter `plan`.

```http
GET /admin/users/:userId
```

Lấy chi tiết một user.

```http
POST /admin/users/topup
```

Payload:

```ts
{
  userId: string;
  amount: number;
}
```

Response:

```ts
{
  success: boolean;
  newBalance: number;
}
```

Chức năng:
- Admin cộng credit cho user.
- Nên tạo luôn credit transaction log loại `Top-up`.

```http
POST /admin/users/change-plan
```

Payload:

```ts
{
  userId: string;
  newPlan: "Free" | "Pro" | "Enterprise";
}
```

Response:

```ts
{
  success: boolean;
  user: AdminUserResponse;
}
```

Hiện UI plan đang comment, nhưng service đã có sẵn.

```http
DELETE /admin/users/:userId
```

Response:

```ts
{
  success: boolean;
}
```

Chức năng:
- Xóa hoặc soft-delete user.
- Nên chặn xóa chính admin hiện tại.

**3. Credit Logs**

```http
GET /admin/credit-logs?page=1&limit=20&search=&type=
```

Response nên là:

```ts
{
  logs: {
    id: string;
    transactionId: string;
    userId: string;
    userEmail: string;
    type: "Top-up" | "Design Generation" | "Refund";
    amount: number;
    status: "Success" | "Failed" | "Pending";
    timestamp: string;
  }[];
  total: number;
  totalCreditsIssued: number;
  totalCreditsUsedToday: number;
}
```

Chức năng:
- Hiển thị toàn bộ giao dịch credit.
- Search theo user email.
- Filter theo loại giao dịch.
- Phân trang.
- Tính tổng credit đã phát hành và credit dùng hôm nay.

Lưu ý: frontend hiện `LogTable` đang render `userEmail` và `status`, nên backend nên trả 2 field này.

**4. System Settings**

```http
GET /admin/config
```

Response:

```ts
{
  success: boolean;
  data: {
    id: string;
    aiModel: {
      apiKey: string;
      version: "gpt-4" | "gpt-3.5-turbo" | "claude-3" | "claude-2";
      maintenanceMode: boolean;
    };
    pricing: {
      creditPrice: number;
      creditsPerGeneration: number;
    };
    security: {
      emailVerificationRequired: boolean;
      newUserBonusCredits: number;
    };
    updatedAt: string;
    updatedBy: string;
  };
  message?: string;
}
```

```http
PUT /admin/config
```

Payload là partial update:

```ts
{
  aiModel?: {
    apiKey?: string;
    version?: string;
    maintenanceMode?: boolean;
  };
  pricing?: {
    creditPrice?: number;
    creditsPerGeneration?: number;
  };
  security?: {
    emailVerificationRequired?: boolean;
    newUserBonusCredits?: number;
  };
}
```

```http
POST /admin/config/reset
```

Reset config về mặc định.

```http
POST /admin/config/validate-key
```

Payload:

```ts
{
  apiKey: string;
  version: string;
}
```

Response:

```ts
{
  valid: boolean;
  error?: string;
}
```

**5. Auth/Permission**

Tất cả endpoint admin nên yêu cầu:

```http
Authorization: Bearer <accessToken>
```

Backend nên kiểm tra:
- Token hợp lệ.
- User có role admin.
- Nếu không login: `401`.
- Nếu login nhưng không phải admin: `403`.

Tóm lại, tối thiểu backend cần có:

```txt
GET    /admin/stats
GET    /admin/users
GET    /admin/users/:userId
POST   /admin/users/topup
POST   /admin/users/change-plan
DELETE /admin/users/:userId
GET    /admin/credit-logs
GET    /admin/config
PUT    /admin/config
POST   /admin/config/reset
POST   /admin/config/validate-key
```