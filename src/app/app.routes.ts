import { Routes } from "@angular/router";
import { HomePage } from "./pages/home.page";
import { NotImplementedComponent } from "./components/not-implemented.component";
import { GameComponent } from "./components/game.component";

export const routes: Routes = [
	{ path: "", redirectTo: "home", pathMatch: "full" },
	{ path: "home", component: HomePage },
	{ path: "not-implemented", component: NotImplementedComponent },
	{ path: "game/:id", component: GameComponent }
];
