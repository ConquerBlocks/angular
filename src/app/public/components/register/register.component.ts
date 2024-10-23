import { appRoutes } from '@/app/app.routes';
import { CustomInputComponent } from '@/app/components';
import { AuthService } from '@/app/services';
import { passwordMatchValidator } from '@/app/validators';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface RegisterForm {
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  registerForm = new FormGroup<RegisterForm>(
    {
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
    },
    { validators: passwordMatchValidator }
  )

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      try {
        await firstValueFrom(this.authService.register(this.registerForm.getRawValue()))

        this.router.navigate([appRoutes.public.login])
      } catch (err) {
        console.error(`can't register`, err)
      }

      this.registerForm.reset();
    }
  }
}
