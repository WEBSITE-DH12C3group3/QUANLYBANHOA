import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../layout/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form!: FormGroup;   // khai báo trước
  error = signal<string | null>(null);
  submittedFlag = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // khởi tạo form trong constructor
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      remember: [false]
    });
  }

  submitted() {
    return this.submittedFlag;
  }

  onSubmit() {
    this.submittedFlag = true;

    if (this.form.invalid) return;

    const { username, password } = this.form.value;
    this.authService.login(username!, password!).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/admin']); // ví dụ chuyển hướng admin
      },
      error: () => {
        this.error.set('Sai email hoặc mật khẩu');
      }
    });
  }
}
