import { appRoutes } from '@/app/app.routes';
import { CustomInputComponent } from '@/app/components';
import { AuthService } from '@/app/services';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  authService = inject(AuthService)
  router = inject(Router)

  loginForm = new FormGroup<LoginForm>({
    email: new FormControl('', { nonNullable: true, validators: [Validators.email, Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  })

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        await firstValueFrom(this.authService.login(this.loginForm.getRawValue()));

        this.router.navigate([appRoutes.public.login])
      } catch (error) {
        console.error(error);
      }
    }

    this.loginForm.reset();
  }
}
