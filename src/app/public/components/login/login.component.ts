import { appRoutes } from '@/app.routes';
import { CustomInputComponent } from '@/components';
import { AuthService, LocalManagerService } from '@/services';
import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  private localManager = inject(LocalManagerService)
  router = inject(Router)

  loginForm = new FormGroup<LoginForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  })

  constructor() {
    afterNextRender(() => {
      this.localManager.clearStorage()
    })
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        await firstValueFrom(this.authService.login(this.loginForm.getRawValue()));
        this.router.navigate([`${appRoutes.private.root}/${appRoutes.private.characters}`], { replaceUrl: true });
      } catch (error) {
        console.error(error)
      }

      this.loginForm.reset()
    }
  }
}
