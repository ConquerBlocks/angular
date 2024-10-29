import { appRoutes } from "@/app.routes";
import { LocalManagerService, LocalKeys } from "@/services";
import { isPlatformServer } from "@angular/common";
import { inject, PLATFORM_ID } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";

export const authGuard: CanActivateChildFn = () => {
  const localManager = inject(LocalManagerService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) { return false }

  const token = localManager.getElement(LocalKeys.accessToken);

  if (token) return true;

  router.navigate([appRoutes.public.login], { replaceUrl: true });
  return false;
};
