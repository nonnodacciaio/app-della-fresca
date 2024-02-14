import { Component } from "@angular/core";
import { GamesListComponent } from "../components/games-list.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ToolbarService } from "../services/toolbar.service";

@Component({
	selector: "home",
	standalone: true,
	imports: [GamesListComponent, MatButtonModule, MatIconModule],
	template: `
		<div class="flex justify-center m-4">
			<button
				mat-raised-button
				color="primary">
				<mat-icon>add</mat-icon>Balla la fresca
			</button>
		</div>
		<games-list></games-list>
	`
})
export class HomePage {
	constructor(private toolbarService: ToolbarService) {
		this.toolbarService.toolbarText = "App della fresca";
	}
}
