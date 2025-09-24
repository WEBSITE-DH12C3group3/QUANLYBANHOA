-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 23, 2025 at 07:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qlbanhoa`
--

-- --------------------------------------------------------

--
-- Table structure for table `chitiethoadon`
--

CREATE TABLE `chitiethoadon` (
  `idHoaDon` int(11) NOT NULL,
  `idSanPham` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `DonGia` decimal(10,2) NOT NULL,
  `ThanhTien` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chitietphieunhap`
--

CREATE TABLE `chitietphieunhap` (
  `idPhieuNhap` int(11) NOT NULL,
  `idSanPham` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `DonGia` decimal(10,2) NOT NULL,
  `ThanhTien` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chucnang`
--

CREATE TABLE `chucnang` (
  `id` int(11) NOT NULL,
  `MaChucNang` varchar(5) DEFAULT NULL,
  `TenChucNang` varchar(255) NOT NULL,
  `TenManHinh` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `chucnang`
--
DELIMITER $$
CREATE TRIGGER `trg_cn_ai` AFTER INSERT ON `chucnang` FOR EACH ROW BEGIN
  UPDATE CHUCNANG
    SET MaChucNang = CONCAT('CN', LPAD(NEW.id, 3, '0'))
  WHERE id = NEW.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `hoadon`
--

CREATE TABLE `hoadon` (
  `id` int(11) NOT NULL,
  `MaHoaDon` varchar(6) DEFAULT NULL,
  `NgayLap` datetime NOT NULL,
  `idKhachHang` int(11) DEFAULT NULL,
  `idNguoiDung` int(11) DEFAULT NULL,
  `TongTien` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `hoadon`
--
DELIMITER $$
CREATE TRIGGER `trg_hd_ai` AFTER INSERT ON `hoadon` FOR EACH ROW BEGIN
  UPDATE HOADON
    SET MaHoaDon = CONCAT('HD', LPAD(NEW.id, 4, '0'))
  WHERE id = NEW.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `khachhang`
--

CREATE TABLE `khachhang` (
  `id` int(11) NOT NULL,
  `MaKhachHang` varchar(6) DEFAULT NULL,
  `TenKhachHang` varchar(255) NOT NULL,
  `DiaChi` text DEFAULT NULL,
  `SoDienThoai` varchar(20) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `khachhang`
--
DELIMITER $$
CREATE TRIGGER `trg_kh_ai` AFTER INSERT ON `khachhang` FOR EACH ROW BEGIN
  UPDATE KHACHHANG
    SET MaKhachHang = CONCAT('KH', LPAD(NEW.id, 4, '0'))
  WHERE id = NEW.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `loaisanpham`
--

CREATE TABLE `loaisanpham` (
  `id` int(11) NOT NULL,
  `MaLoaiSanPham` varchar(6) DEFAULT NULL,
  `TenLoaiSanPham` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `loaisanpham`
--
DELIMITER $$
CREATE TRIGGER `trg_lsp_ai` AFTER INSERT ON `loaisanpham` FOR EACH ROW BEGIN
  UPDATE LOAISANPHAM
    SET MaLoaiSanPham = CONCAT('LSP', LPAD(NEW.id, 3, '0'))
  WHERE id = NEW.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `nguoidung`
--

CREATE TABLE `nguoidung` (
  `id` int(11) NOT NULL,
  `MaNguoiDung` varchar(6) DEFAULT NULL,
  `TenNguoiDung` varchar(255) NOT NULL,
  `TenDangNhap` varchar(100) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `idNhomNguoiDung` int(11) NOT NULL,
  `CaLamViec` varchar(50) DEFAULT NULL,
  `MaNhanVien` varchar(6) DEFAULT NULL,
  `LuongCoDinh` decimal(10,2) DEFAULT NULL,
  `NgayBatDauLam` datetime DEFAULT NULL,
  `TrangThai` varchar(50) DEFAULT 'Đang làm'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `nguoidung`
--
DELIMITER $$
CREATE TRIGGER `trg_nd_ai` AFTER INSERT ON `nguoidung` FOR EACH ROW BEGIN
  UPDATE NGUOIDUNG
    SET MaNguoiDung = CONCAT('ND', LPAD(NEW.id, 4, '0')),
        MaNhanVien  = CONCAT('NV', LPAD(NEW.id, 4, '0'))
  WHERE id = NEW.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `nhacungcap`
--

CREATE TABLE `nhacungcap` (
  `id` int(11) NOT NULL,
  `MaNhaCungCap` varchar(6) DEFAULT NULL,
  `TenNhaCungCap` varchar(255) NOT NULL,
  `DiaChi` text DEFAULT NULL,
  `SoDienThoai` varchar(20) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `nhacungcap`
--
DELIMITER $$
CREATE TRIGGER `trg_ncc_ai` AFTER INSERT ON `nhacungcap` FOR EACH ROW BEGIN
  UPDATE NHACUNGCAP
    SET MaNhaCungCap = CONCAT('NCC', LPAD(NEW.id, 3, '0'))
  WHERE id = NEW.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `nhomnguoidung`
--

CREATE TABLE `nhomnguoidung` (
  `id` int(11) NOT NULL,
  `MaNhomNguoiDung` varchar(6) DEFAULT NULL,
  `TenNhomNguoiDung` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `nhomnguoidung`
--
DELIMITER $$
CREATE TRIGGER `trg_nnd_ai` AFTER INSERT ON `nhomnguoidung` FOR EACH ROW BEGIN
  UPDATE NHOMNGUOIDUNG
    SET MaNhomNguoiDung = CONCAT('NND', LPAD(NEW.id, 3, '0'))
  WHERE id = NEW.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `phanquyen`
--

CREATE TABLE `phanquyen` (
  `idNhomNguoiDung` int(11) NOT NULL,
  `idChucNang` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phieunhap`
--

CREATE TABLE `phieunhap` (
  `id` int(11) NOT NULL,
  `MaPhieuNhap` varchar(6) DEFAULT NULL,
  `NgayNhap` datetime NOT NULL,
  `idNhaCungCap` int(11) DEFAULT NULL,
  `idNguoiDung` int(11) DEFAULT NULL,
  `TongTien` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `phieunhap`
--
DELIMITER $$
CREATE TRIGGER `trg_pn_ai` AFTER INSERT ON `phieunhap` FOR EACH ROW BEGIN
  UPDATE PHIEUNHAP
    SET MaPhieuNhap = CONCAT('PN', LPAD(NEW.id, 4, '0'))
  WHERE id = NEW.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `sanpham`
--

CREATE TABLE `sanpham` (
  `id` int(11) NOT NULL,
  `MaSanPham` varchar(5) DEFAULT NULL,
  `TenSanPham` varchar(255) NOT NULL,
  `MoTa` text DEFAULT NULL,
  `Gia` decimal(10,2) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `DaBan` int(11) DEFAULT 0,
  `MauSac` varchar(50) DEFAULT NULL,
  `AnhChiTiet` varchar(255) DEFAULT NULL,
  `idNhaCungCap` int(11) DEFAULT NULL,
  `idLoaiSanPham` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `sanpham`
--
DELIMITER $$
CREATE TRIGGER `trg_sp_ai` AFTER INSERT ON `sanpham` FOR EACH ROW BEGIN
  UPDATE SANPHAM
    SET MaSanPham = CONCAT('SP', LPAD(NEW.id, 3, '0'))
  WHERE id = NEW.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `thamso`
--

CREATE TABLE `thamso` (
  `id` int(11) NOT NULL,
  `SoLuongTonToiThieu` int(11) NOT NULL,
  `MucGiamGia` decimal(5,2) DEFAULT 0.00,
  `ThoiGianBaoHanh` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chitiethoadon`
--
ALTER TABLE `chitiethoadon`
  ADD PRIMARY KEY (`idHoaDon`,`idSanPham`),
  ADD KEY `fk_cthd_sp` (`idSanPham`);

--
-- Indexes for table `chitietphieunhap`
--
ALTER TABLE `chitietphieunhap`
  ADD PRIMARY KEY (`idPhieuNhap`,`idSanPham`),
  ADD KEY `fk_ctpn_sp` (`idSanPham`);

--
-- Indexes for table `chucnang`
--
ALTER TABLE `chucnang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MaChucNang` (`MaChucNang`);

--
-- Indexes for table `hoadon`
--
ALTER TABLE `hoadon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MaHoaDon` (`MaHoaDon`),
  ADD KEY `fk_hd_kh` (`idKhachHang`),
  ADD KEY `fk_hd_nd` (`idNguoiDung`);

--
-- Indexes for table `khachhang`
--
ALTER TABLE `khachhang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MaKhachHang` (`MaKhachHang`);

--
-- Indexes for table `loaisanpham`
--
ALTER TABLE `loaisanpham`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MaLoaiSanPham` (`MaLoaiSanPham`);

--
-- Indexes for table `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `TenDangNhap` (`TenDangNhap`),
  ADD UNIQUE KEY `MaNguoiDung` (`MaNguoiDung`),
  ADD UNIQUE KEY `MaNhanVien` (`MaNhanVien`),
  ADD KEY `fk_nd_nnd` (`idNhomNguoiDung`);

--
-- Indexes for table `nhacungcap`
--
ALTER TABLE `nhacungcap`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MaNhaCungCap` (`MaNhaCungCap`);

--
-- Indexes for table `nhomnguoidung`
--
ALTER TABLE `nhomnguoidung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MaNhomNguoiDung` (`MaNhomNguoiDung`);

--
-- Indexes for table `phanquyen`
--
ALTER TABLE `phanquyen`
  ADD PRIMARY KEY (`idNhomNguoiDung`,`idChucNang`),
  ADD KEY `fk_pq_cn` (`idChucNang`);

--
-- Indexes for table `phieunhap`
--
ALTER TABLE `phieunhap`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MaPhieuNhap` (`MaPhieuNhap`),
  ADD KEY `fk_pn_ncc` (`idNhaCungCap`),
  ADD KEY `fk_pn_nd` (`idNguoiDung`);

--
-- Indexes for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MaSanPham` (`MaSanPham`),
  ADD KEY `fk_sp_ncc` (`idNhaCungCap`),
  ADD KEY `fk_sp_lsp` (`idLoaiSanPham`);

--
-- Indexes for table `thamso`
--
ALTER TABLE `thamso`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chucnang`
--
ALTER TABLE `chucnang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hoadon`
--
ALTER TABLE `hoadon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `khachhang`
--
ALTER TABLE `khachhang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loaisanpham`
--
ALTER TABLE `loaisanpham`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nhacungcap`
--
ALTER TABLE `nhacungcap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nhomnguoidung`
--
ALTER TABLE `nhomnguoidung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phieunhap`
--
ALTER TABLE `phieunhap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sanpham`
--
ALTER TABLE `sanpham`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thamso`
--
ALTER TABLE `thamso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chitiethoadon`
--
ALTER TABLE `chitiethoadon`
  ADD CONSTRAINT `fk_cthd_hd` FOREIGN KEY (`idHoaDon`) REFERENCES `hoadon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cthd_sp` FOREIGN KEY (`idSanPham`) REFERENCES `sanpham` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chitietphieunhap`
--
ALTER TABLE `chitietphieunhap`
  ADD CONSTRAINT `fk_ctpn_pn` FOREIGN KEY (`idPhieuNhap`) REFERENCES `phieunhap` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctpn_sp` FOREIGN KEY (`idSanPham`) REFERENCES `sanpham` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `hoadon`
--
ALTER TABLE `hoadon`
  ADD CONSTRAINT `fk_hd_kh` FOREIGN KEY (`idKhachHang`) REFERENCES `khachhang` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_hd_nd` FOREIGN KEY (`idNguoiDung`) REFERENCES `nguoidung` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD CONSTRAINT `fk_nd_nnd` FOREIGN KEY (`idNhomNguoiDung`) REFERENCES `nhomnguoidung` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `phanquyen`
--
ALTER TABLE `phanquyen`
  ADD CONSTRAINT `fk_pq_cn` FOREIGN KEY (`idChucNang`) REFERENCES `chucnang` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pq_nnd` FOREIGN KEY (`idNhomNguoiDung`) REFERENCES `nhomnguoidung` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `phieunhap`
--
ALTER TABLE `phieunhap`
  ADD CONSTRAINT `fk_pn_ncc` FOREIGN KEY (`idNhaCungCap`) REFERENCES `nhacungcap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pn_nd` FOREIGN KEY (`idNguoiDung`) REFERENCES `nguoidung` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `fk_sp_lsp` FOREIGN KEY (`idLoaiSanPham`) REFERENCES `loaisanpham` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sp_ncc` FOREIGN KEY (`idNhaCungCap`) REFERENCES `nhacungcap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
