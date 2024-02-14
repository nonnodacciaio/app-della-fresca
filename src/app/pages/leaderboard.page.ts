import { Component } from "@angular/core";
import { ToolbarService } from "../services/toolbar.service";

@Component({ selector: "leaderboard", standalone: true, template: `<h3 class="text-center">Work in progress</h3>` })
export class LeaderboardPage {
	constructor(private toolbarService: ToolbarService) {
		this.toolbarService.toolbarText = "Classifica";
	}
}
