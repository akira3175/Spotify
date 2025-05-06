# Thông Tin Sinh Viên
- Phạm Thiên Phú - 3122560059
- Nguyễn Quốc Tuấn - 3122560087
- Nguyễn Minh Phúc - 3122560061
- Nguyễn Nhật Trường - 3122410441

# Hướng Dẫn Cài Đặt Spotify Clone

## Yêu Cầu Hệ Thống
- Node.js (phiên bản 14.0.0 trở lên)
- npm hoặc yarn
- MongoDB
- Git

## Các Bước Cài Đặt

### 1. Clone Repository
```bash
git clone https://github.com/[username]/spotify-clone.git
cd spotify-clone
```

### 2. Cài Đặt Dependencies
```bash
# Cài đặt dependencies cho backend
cd backend
npm install

# Cài đặt dependencies cho frontend
cd ../frontend
npm install
```

### 3. Cấu Hình Môi Trường
#### Backend
Tạo file `.env` trong thư mục backend với nội dung:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spotify
JWT_SECRET=your_jwt_secret
```

#### Frontend
Tạo file `.env` trong thư mục frontend với nội dung:
```
REACT_APP_API_URL=http://localhost:5000
```

### 4. Khởi Chạy Ứng Dụng
```bash
# Khởi chạy backend
cd backend
npm start

# Khởi chạy frontend (trong terminal mới)
cd frontend
npm start
```

### 5. Truy Cập Ứng Dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

## Tính Năng Chính
- Đăng ký và đăng nhập tài khoản
- Quản lý bạn bè
- Quản lý playlist
- Tìm kiếm và phát nhạc
- Quản lý tài khoản
- Tin nhắn
- Theo dõi nghệ sĩ
- Mua nhạc
- Lịch sử mua hàng
- Bài hát đã thích

## Cấu Trúc Dự Án
```
spotify-clone/
├── backend/           # Backend API
├── frontend/          # Frontend React
├── docs/             # Tài liệu
└── README.md         # Hướng dẫn cài đặt
```

## Liên Hệ
Nếu có thắc mắc hoặc gặp vấn đề trong quá trình cài đặt, vui lòng liên hệ qua email hoặc tạo issue trên GitHub.