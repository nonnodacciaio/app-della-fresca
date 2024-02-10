import { Routes } from "@angular/router";
import { HomePage } from "./pages/home.page";

export const routes: Routes = [
	{ path: "", redirectTo: "home", pathMatch: "full" },
	{ path: "home", component: HomePage },
	{ path: "**", redirectTo: "home" }
];
