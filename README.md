# 4Guys

## Mô tả
Dự án **4Guys** là một ứng dụng web sử dụng React và Three.js để tạo ra các trải nghiệm đồ họa 3D tương tác. Dự án được xây dựng với sự hỗ trợ của Vite để tăng tốc độ phát triển.

Game được thiết kế với các tính năng nổi bật như môi trường 3D sống động, nhân vật có thể di chuyển qua các tầng lục giác, chế độ multiplayer hỗ trợ từ 2-10 người chơi, và các hiệu ứng âm thanh, chuyển động mượt mà.

## Tính năng chính
### 1. Môi Trường 3D (Background)
- **Cảnh vật (Environment)**:
  - Mô phỏng các tầng lục giác (hexagonal tiles) nhiều màu sắc (vàng, xanh dương, tím) trải dài trên nền trời sáng và đầy mây.
  - Sử dụng WebGL kết hợp với Three.js để render cảnh quan, với các mô hình 3D dạng hình học.
  - Tạo ánh sáng và bóng đổ động (dynamic shadows) để làm nổi bật các đối tượng.

- **Tầng lục giác (Hexagon Tiles)**:
  - Các ô lục giác thay đổi màu sắc khi bị dẫm lên và biến mất từ từ với hiệu ứng GSAP.
  - Camera sẽ quay từ trên xuống dưới khi nhân vật rơi xuống tầng tiếp theo, tạo cảm giác kịch tính.

### 2. Nhân Vật (Character)
- Nhân vật có thể di chuyển qua các tiles, thực hiện các thao tác như chạy, nhảy, và quay trái/phải.
- Trọng lực được mô phỏng khi nhân vật rơi xuống tầng dưới.
- Camera luôn theo dõi nhân vật, tạo cảm giác dễ quan sát và định vị.

### 3. Multiplayer (2-10 người chơi)
- Hỗ trợ từ 2 đến 10 người chơi đồng thời.
- Người chơi thi đấu để cố gắng tồn tại càng lâu càng tốt trên các ô lục giác.

### 4. Hiệu Ứng & Âm Thanh
- Hiệu ứng âm thanh sống động khi nhân vật di chuyển hoặc rơi xuống tầng.
- GSAP được sử dụng để tạo các hiệu ứng chuyển động mượt mà.

### 5. Quản Lý Tầng (Rounds)
- Mỗi round bao gồm từ 5-7 tầng, mỗi tầng có màu sắc khác nhau.
- Người chơi di chuyển qua các tầng và nếu không cẩn thận sẽ rơi xuống tầng tiếp theo.

## Cài đặt
1. Clone repository:
   ```bash
   git clone https://github.com/kuongan/4Guys.git
   cd 4Guys
   ```

2. Cài đặt các dependencies:
   ```bash
   npm install
   ```

## Scripts
- **Phát triển**: 
  ```bash
  npm run dev
  ```
  Chạy ứng dụng ở chế độ phát triển.

- **Build**:
  ```bash
  npm run build
  ```
  Tạo bản build sản phẩm.

- **Preview**:
  ```bash
  npm run preview
  ```
  Xem trước bản build.

## Công nghệ sử dụng
- **React**: ^18.2.0
- **Three.js**: 0.153.0
- **Tailwind CSS**: ^3.4.3
- **Vite**: ^6.3.5
- **GSAP**: Hiệu ứng chuyển động mượt mà.


## Thông tin thêm
Dự án sử dụng các thư viện hỗ trợ như:
- `@react-three/drei`
- `@react-three/fiber`
- `@react-three/rapier`
- `playroomkit`

Hãy tham khảo file `package.json` để biết thêm chi tiết về các dependencies.

## Flow Game
1. **Bắt đầu game**:
   - Người chơi chọn nhân vật, skin, và gia nhập game.
   - Các tầng lục giác được tạo ra ngẫu nhiên và người chơi bắt đầu trên tầng cao nhất.

2. **Diễn biến trong game**:
   - Người chơi di chuyển trên các tầng lục giác, mỗi lần dẫm lên một tile sẽ khiến tile đó biến mất.
   - Khi một người chơi rơi xuống tầng cuối cùng, họ bị loại.

3. **Kết thúc game**:
   - Người chơi cuối cùng còn lại sẽ chiến thắng và nhận thông báo kèm hiệu ứng âm thanh chiến thắng.

## Đóng góp
Nếu bạn muốn đóng góp cho dự án, vui lòng tạo một pull request hoặc mở issue để thảo luận.
