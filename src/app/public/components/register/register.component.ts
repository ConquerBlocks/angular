import { appRoutes } from '@/app.routes';
import { CustomInputComponent } from '@/components';
import { AuthService, LocalManagerService } from '@/services';
import { passwordMatchValidator } from '@/validators/password-match.validator';
import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, VirtualAction } from 'rxjs';

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
  authService = inject(AuthService)
  localManager = inject(LocalManagerService)
  route = inject(Router)

  registerForm = new FormGroup<RegisterForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    }),
  },
    { validators: passwordMatchValidator }
  )

  constructor() {
    afterNextRender(() => {
      this.localManager.clearStorage()
    })
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        const toSend = {
          email: this.registerForm.getRawValue().email,
          password: this.registerForm.getRawValue().password
        }

        await firstValueFrom(this.authService.register(toSend));
        this.route.navigate([appRoutes.public.login], { replaceUrl: true });
      } catch (error) {
        console.error(error)
      }

      this.registerForm.reset()
    }
  }
}
