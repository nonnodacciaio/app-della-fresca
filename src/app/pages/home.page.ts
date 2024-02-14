import { Component } from "@angular/core";
import { GamesListComponent } from "../components/games-list.component";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "home",
	standalone: true,
	imports: [GamesListComponent, MatButtonModule],
	template: `<h1 class="text-center">Benvenuto nell'app della fresca</h1>
		<h3 class="text-center">Work in progress</h3>
		<h3 class="text-center">Wondah i tuoi fogli excel sono essenziali</h3>
		<div class="flex justify-center m-4">
			<button
				mat-raised-button
				color="primary">
				Balla la fresca
			</button>
		</div>
		<games-list></games-list> `
})
export class HomePage {}
