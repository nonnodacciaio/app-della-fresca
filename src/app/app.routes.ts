import { Routes } from "@angular/router";
import { HomePage } from "./pages/home.page";
import { NotImplementedComponent } from "./components/not-implemented.component";
import { GameComponent } from "./components/game.component";
import { LeaderboardPage } from "./pages/leaderboard.page";
import { SettingsPage } from "./pages/settings.page";
import { AboutPage } from "./pages/about.page";

export const routes: Routes = [
	{ path: "", redirectTo: "home", pathMatch: "full" },
	{ path: "home", component: HomePage },
	{ path: "not-implemented", component: NotImplementedComponent },
	{ path: "game/:id", component: GameComponent },
	{ path: "leaderboard", component: LeaderboardPage },
	{ path: "settings", component: SettingsPage },
	{ path: "about", component: AboutPage }
];
