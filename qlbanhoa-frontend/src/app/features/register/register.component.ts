import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../layout/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  fullName = '';
  email = '';
  phone = '';
  passwordHash = '';
  message = '';

  constructor(private authService: AuthService) {}

  onRegister() {
    const payload = {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      passwordHash: this.passwordHash
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log('Register success:', res);
        this.message = 'Đăng ký thành công!';
      },
      error: (err) => {
        console.error('Register failed:', err);
        this.message = 'Lỗi đăng ký, thử lại';
      }
    });
  }
}
