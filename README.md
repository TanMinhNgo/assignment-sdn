# Perfume Collection - Assignment SDN

Ứng dụng quản lý nước hoa với chức năng tìm kiếm, lọc, đánh giá và quản lý thành viên.

## Tính năng đã hoàn thành

### Task 1 - Assignment 2 ✅

- [x] Route index hiển thị tất cả perfumes (name, image, targetAudience, brandName)
- [x] Route chi tiết perfume với đầy đủ thông tin
- [x] Search theo tên perfume
- [x] Filter theo brand name
- [x] Đăng ký tài khoản (default không phải Admin)
- [x] Đăng nhập (local + Google OAuth2)
- [x] Member có thể edit thông tin của mình
- [x] Member có thể đổi password
- [x] Member có thể feedback và rating perfume (mỗi perfume 1 lần)
- [x] Outstanding design cho Extrait concentration

### Task 2 - Assignment 3 ✅

- [x] Chỉ Admin có thể GET, POST, PUT, DELETE brands
- [x] Chỉ Admin có thể GET, POST, PUT, DELETE perfumes
- [x] Public routes cho GET operations

### Task 3 - Assignment 4 ✅

- [x] Implement feedback feature (comment + rating)
- [x] Chỉ members mới có thể feedback
- [x] Mỗi member chỉ feedback 1 perfume 1 lần
- [x] Member có thể edit/delete feedback của mình

### Task 4 - Assignment 4 ✅

- [x] /collectors endpoint cho Admin
- [x] Admin có thể GET danh sách all members
- [x] Members thường không được phép

## Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd assignment-sdn

# Cài đặt dependencies
bun install

# Tạo file .env với nội dung:
MONGO_URI=mongodb://localhost:27017/perfume-collection
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret

# Chạy ứng dụng
bun start
# hoặc
npm start
```

## API Endpoints

### Public Routes (Không cần authentication)

- `GET /` - Trang chủ với danh sách perfumes
- `GET /perfumes/:id` - Chi tiết perfume
- `GET /brands` - Danh sách brands
- `GET /brands/:brandId` - Chi tiết brand
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập

### Member Routes (Cần authentication)

- `GET /auth/profile` - Trang profile
- `PUT /members/:memberId` - Cập nhật thông tin (chỉ được edit của mình)
- `PUT /members/:memberId/password` - Đổi password
- `POST /perfumes/:perfumeId/comments` - Thêm comment
- `PUT /perfumes/:perfumeId/comments/:commentId` - Sửa comment của mình
- `DELETE /perfumes/:perfumeId/comments/:commentId` - Xóa comment của mình

### Admin Routes (Chỉ Admin)

- `POST /brands` - Tạo brand mới
- `PUT /brands/:brandId` - Sửa brand
- `DELETE /brands/:brandId` - Xóa brand
- `POST /perfumes` - Tạo perfume mới
- `PUT /perfumes/:perfumeId` - Sửa perfume
- `DELETE /perfumes/:perfumeId` - Xóa perfume
- `GET /collectors` - Xem danh sách all members

## Models

### Member

```javascript
{
  membername: String,
  password: String (hashed),
  email: String (unique),
  isAdmin: Boolean (default: false)
}
```

### Brand

```javascript
{
  brandName: String;
}
```

### Perfume

```javascript
{
  perfumeName: String,
  uri: String (image URL),
  price: Number,
  concentration: String (Extrait, EDP, EDT, etc.),
  description: String,
  ingredients: String,
  volume: Number,
  targetAudience: String (male, female, unisex),
  comments: [Comment],
  brand: ObjectId (ref: Brand)
}
```

### Comment

```javascript
{
  rating: Number (1-5),
  content: String,
  author: ObjectId (ref: Member)
}
```

## Tạo Admin User

Để tạo admin user, bạn có thể:

1. Đăng ký account bình thường
2. Vào MongoDB và update field `isAdmin` thành `true`:

```javascript
db.members.updateOne(
  { email: 'your-email@example.com' },
  { $set: { isAdmin: true } }
);
```

## Tính năng nổi bật

### 1. Mongoose Population

- Perfumes được populate với Brand information
- Comments được populate với Member (author) information

### 2. Authentication & Authorization

- Session-based authentication với Passport
- Google OAuth2 integration
- Role-based access control (Admin/Member)

### 3. Search & Filter

- Search perfumes by name
- Filter perfumes by brand

### 4. Outstanding Design cho Extrait

- Perfumes với concentration "Extrait" có thiết kế đặc biệt với gradient background
- Hiển thị icon ✨ để highlight premium quality

### 5. Comment System

- Mỗi member chỉ comment 1 lần trên mỗi perfume
- Member có thể edit/delete comment của mình
- Rating từ 1-5 sao

## Bảo mật

- Passwords được hash với bcrypt (10 rounds)
- Session management với express-session
- CSRF protection thông qua session
- Authorization middleware cho Admin routes
- Member chỉ có thể edit thông tin của chính mình

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: Passport.js, Google OAuth2
- **Template Engine**: EJS
- **Session**: express-session
- **Password Hashing**: bcrypt
- **Package Manager**: Bun (hoặc npm)

## License

MIT
