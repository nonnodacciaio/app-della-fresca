import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";

import { provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { provideFirestore } from "@angular/fire/firestore";
import { getPerformance, providePerformance } from "@angular/fire/performance";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { routes } from "./app.routes";

const firebaseConfig = {
	apiKey: "AIzaSyAjQ3JQlqZfazJM0MI6YHi9iVlKZzBFvuY",
	authDomain: "app-della-fresca.firebaseapp.com",
	projectId: "app-della-fresca",
	storageBucket: "app-della-fresca.appspot.com",
	messagingSenderId: "329030970527",
	appId: "1:329030970527:web:f0652b4845a292c149c6aa"
};

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideAnimationsAsync(),
		importProvidersFrom(provideFirebaseApp(() => initializeApp(firebaseConfig))),
		importProvidersFrom(provideAuth(() => getAuth())),
		importProvidersFrom(provideFirestore(() => getFirestore())),
		importProvidersFrom(providePerformance(() => getPerformance()))
	]
};
