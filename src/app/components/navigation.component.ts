import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

@Component({
	selector: "navigation",
	standalone: true,
	template: `<ul class="m-4">
		<li>
			<a
				[routerLink]="'home'"
				[routerLinkActive]="['active']"
				>Home</a
			>
		</li>
		<li>
			<a
				[routerLink]="'leaderboard'"
				[routerLinkActive]="['active']"
				>Classifica giocatori</a
			>
		</li>
		<li>
			<a
				[routerLink]="'settings'"
				[routerLinkActive]="['active']"
				>Impostazioni</a
			>
		</li>
		<li>
			<a
				[routerLink]="'about'"
				[routerLinkActive]="['active']"
				>About</a
			>
		</li>
	</ul>`,
	styles: [
		`
			.active {
				color: #ffd740;
			}
		`
	],
	imports: [RouterModule]
})
export class NavigationComponent {}
