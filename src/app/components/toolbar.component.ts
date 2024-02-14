import { Component, EventEmitter, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { ToolbarService } from "../services/toolbar.service";

@Component({
	selector: "toolbar",
	standalone: true,
	template: `<mat-toolbar
		color="primary"
		class="flex items-center space-x-2">
		<button
			mat-icon-button
			(click)="toggleSidenav.emit()">
			<mat-icon>menu</mat-icon>
		</button>
		<div>{{ service.toolbarText }}</div>
	</mat-toolbar> `,
	imports: [MatToolbarModule, MatIconModule, MatSidenavModule]
})
export class ToolbarComponent {
	@Output() toggleSidenav = new EventEmitter<void>();
	constructor(public service: ToolbarService) {}
}
