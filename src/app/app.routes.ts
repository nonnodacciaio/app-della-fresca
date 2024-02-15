import { Routes } from "@angular/router";
import { GameComponent } from "./components/game.component";
import { AboutPage } from "./pages/about.page";
import { HomePage } from "./pages/home.page";
import { LeaderboardPage } from "./pages/leaderboard.page";
import { SettingsPage } from "./pages/settings.page";

export const routes: Routes = [
	{ path: "", redirectTo: "home", pathMatch: "full" },
	{ path: "home", component: HomePage },
	{ path: "game/:id", component: GameComponent },
	{ path: "leaderboard", component: LeaderboardPage },
	{ path: "settings", component: SettingsPage },
	{ path: "about", component: AboutPage }
];
