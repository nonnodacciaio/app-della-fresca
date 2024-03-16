import { Component, ViewChild } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { ToolbarComponent } from "./components/toolbar.component";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { NavigationComponent } from "./components/navigation.component";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, ToolbarComponent, MatSidenavModule, MatButtonModule, NavigationComponent],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css"
})
export class AppComponent {
	@ViewChild("drawer") drawer: MatDrawer | undefined;
	title = "app-della-fresca";

	constructor(private router: Router) {
		this.router.events.subscribe(() => {
			this.drawer?.close();
		});
	}
}
