import { Component } from "@angular/core";
import { GamesListComponent } from "../components/games-list.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "home",
	standalone: true,
	imports: [GamesListComponent, MatButtonModule, MatIconModule],
	template: `<h1 class="text-center">Benvenuto nell'app della fresca</h1>
		<h3 class="text-center">Work in progress</h3>
		<div class="flex justify-center m-4">
			<button
				mat-raised-button
				color="primary">
				<mat-icon>add</mat-icon>Balla la fresca
			</button>
		</div>
		<games-list></games-list> `
})
export class HomePage {}
