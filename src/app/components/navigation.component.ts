import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

@Component({
	selector: "navigation",
	standalone: true,
	template: `<ul class="m-4 text-xl">
		<li class="object-contain">
			<img
				src="/assets/icons/icon-192x192.png"
				alt="Logo" />
		</li>
		<li class="hover:opacity-50">
			<a
				[routerLink]="'home'"
				[routerLinkActive]="['active']"
				>Home</a
			>
		</li>
		<li class="hover:opacity-50">
			<a
				[routerLink]="'leaderboard'"
				[routerLinkActive]="['active']"
				>Classifica giocatori</a
			>
		</li>
		<li class="hover:opacity-50">
			<a
				[routerLink]="'settings'"
				[routerLinkActive]="['active']"
				>Impostazioni</a
			>
		</li>
		<li class="hover:opacity-50">
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
