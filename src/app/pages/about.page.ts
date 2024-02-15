import { Component } from "@angular/core";
import { ToolbarService } from "../services/toolbar.service";

@Component({
	selector: "about",
	standalone: true,
	template: `<h3 class="text-center">Work in progress</h3>
		<h3 class="text-center">Wondah i tuoi fogli excel sono essenziali</h3>
		<h3 class="text-center">
			Se volete potete offrirmi una birretta
			<a
				href="https://www.buymeacoffee.com/nonnodacci1"
				target="_blank"
				style="color: #ffd740"
				class="hover:underline"
				>qui</a
			>. Tanto poi i proventi me li ballo tutti
		</h3> `
})
export class AboutPage {
	constructor(private toolbarService: ToolbarService) {
		this.toolbarService.toolbarText = "About";
	}
}
