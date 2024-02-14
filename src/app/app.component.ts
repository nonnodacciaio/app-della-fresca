import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToolbarComponent } from "./components/toolbar.component";
import { MatSidenavModule } from "@angular/material/sidenav";
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
	title = "app-della-fresca";
}
