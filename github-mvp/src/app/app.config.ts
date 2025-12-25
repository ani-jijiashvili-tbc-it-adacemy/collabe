import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50:  '#e0f7ff',
            100: '#b3e9ff',
            200: '#80daff',
            300: '#4dcbff',
            400: '#1abdff',
            500: '#00adee',
            600: '#009bd6',
            700: '#0084b8',
            800: '#006e99',
            900: '#00587a',
            950: '#00425c'
        }
    }
});
 
export const appConfig: ApplicationConfig = {
  
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimations(),provideZonelessChangeDetection(),
   providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark',
          prefix: 'p',
          cssLayer: false,
        },
      },
    }),
  ],
};
