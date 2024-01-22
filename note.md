# Default account

email: admin@gmail.com
password: admin123456789

# Flow limit access device
- Lần đầu khi login, tạo 1 token -> Lưu token vào cookie và database (Lưu cả các thông tin mà đề bài yêu cầu)
- Viết middleware lấy token trong cookie. Tìm xem token vừa lấy có trong database không
    + Nếu không:
        Cho về trang login
    + Nếu có:
        Kiểm tra trạng thái của token là true hay false
        Nếu true:
            next
        Nếu false:
            Trở về trang login
    + Lưu ý:
        middleware sẽ được đặt trước route của trang chủ
- Từ những lần login sau, kiểm tra tài khoản, mật khẩu đúng
- Lấy token trong cookie để cập nhật trạng thái trình duyệt trong database thành true


# Flow 2
- Lần đầu vào trang.
    Kiểm tra xem trong cookie của người dùng có token hay không
        Nếu có thì tìm xem trong database có token đó hay không
            Nếu có
                Kiểm tra xem trạng thái đang là true hay false
                    Nếu true thì next
                    Nếu false thì bắt ra trang login
            Nếu không thì bắt ra trang login
        Nếu không thì bắt ra trang login

- Khi login
    Nếu là mới login bằng tài khoản ... trên thiết bị mới
        Tạo một uuid và lưu nó vào local storage như tên của thiết bị
        Tạo một token - Lưu vào cookie
        Lấy ra được thông tin của trình duyệt và hệ điều hành
        Thêm toàn thông tin vừa lấy được bên trên vào db (bảng login_infos)
        next
    Nếu là login bằng tài khoản ... trên thiết bị cũ
        Lấy tên thiết bị trong local storage
        Tìm trong db (bảng login_infos)
            Chuyển status sang true và next

- 