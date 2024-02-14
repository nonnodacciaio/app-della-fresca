import { Component, EventEmitter, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";

@Component({
	selector: "toolbar",
	standalone: true,
	template: `<mat-toolbar
		color="primary"
		class="flex items-center">
		<button
			mat-icon-button
			(click)="toggleSidenav.emit()">
			<mat-icon>menu</mat-icon>
		</button>
		<span class="mx-4">App della fresca</span>
	</mat-toolbar> `,
	imports: [MatToolbarModule, MatIconModule, MatSidenavModule]
})
export class ToolbarComponent {
	@Output() toggleSidenav = new EventEmitter<void>();
}
