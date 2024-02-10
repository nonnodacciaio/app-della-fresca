import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getPerformance, providePerformance } from '@angular/fire/performance';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"app-della-fresca","appId":"1:329030970527:web:f0652b4845a292c149c6aa","storageBucket":"app-della-fresca.appspot.com","apiKey":"AIzaSyAjQ3JQlqZfazJM0MI6YHi9iVlKZzBFvuY","authDomain":"app-della-fresca.firebaseapp.com","messagingSenderId":"329030970527"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(providePerformance(() => getPerformance()))]
};
