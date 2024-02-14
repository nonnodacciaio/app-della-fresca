import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToolbarComponent } from "./components/toolbar.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, ToolbarComponent, MatSidenavModule, MatButtonModule],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css"
})
export class AppComponent {
	title = "app-della-fresca";
}
