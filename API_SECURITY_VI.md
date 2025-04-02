# Tài liệu Bảo mật API

## Tổng quan
Tài liệu này giải thích cách triển khai bảo mật cho API của hệ thống ECMS (Hệ thống Quản lý Nội dung Thương mại điện tử) sử dụng API Keys và Tokens.

## Các tầng bảo mật

### 1. Xác thực bằng API Key 
API Key được sử dụng để xác định service/ứng dụng nào đang gọi đến hệ thống của chúng ta.

#### Mục đích
- Xác định service gọi API (Web Client, Mobile App, Admin Portal, v.v.)
- Kiểm soát và theo dõi lưu lượng API cho từng service
- Giới hạn tốc độ truy cập cho từng service
- Tầng bảo mật cơ bản

#### Cách triển khai
```typescript
headers: {
  'x-api-key': 'your-api-key-here'
}