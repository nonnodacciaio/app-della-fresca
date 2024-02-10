import { Component } from "@angular/core";
import { GamesListComponent } from "../components/games-list.component";

@Component({
	selector: "home",
	standalone: true,
	imports: [GamesListComponent],
	template: `<h1 class="text-center">Benvenuto nell'app della fresca</h1>
		<h3 class="text-center">Work in progress</h3>
		<games-list></games-list> `
})
export class HomePage {}
