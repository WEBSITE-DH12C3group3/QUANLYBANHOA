import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../layout/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ cần để Angular hiểu formGroup
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: string | null = null;
  submittedFlag = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    // ✅ Tạo FormGroup với field email, password, remember
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      remember: [false]
    });
  }

  submitted() {
    return this.submittedFlag;
  }

  error() {
    return this.errorMessage;
  }

  onSubmit() {
    this.submittedFlag = true;
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

this.auth.login(this.form.value.email, this.form.value.password).subscribe({
  next: (res) => {
    console.log("Login success:", res);
    this.router.navigate(['/admin']);
  },
  error: (err) => {
    console.error("Login failed", err);
  }
});

  }
}
