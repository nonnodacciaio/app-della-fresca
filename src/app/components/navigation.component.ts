import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
	selector: "navigation",
	standalone: true,
	template: `<ul class="m-4">
		<li><a [routerLink]="'home'">Home</a></li>
		<li><a [routerLink]="'leaderboard'">Classifica giocatori</a></li>
		<li><a [routerLink]="'settings'">Impostazioni</a></li>
		<li><a [routerLink]="'about'">About</a></li>
	</ul>`,
	imports: [RouterModule]
})
export class NavigationComponent {}
