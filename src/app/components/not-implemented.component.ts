import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";

@Component({
	selector: "not-implemented",
	standalone: true,
	template: `<div class="flex flex-col justify-center items-center">
		<h3 class="text-center">Eh vecio sta roba qua non l'ho ancora fatta</h3>
		<a
			mat-button
			color="accent"
			class="text-center w-fit"
			(click)="goBack()"
			>Torna indietro</a
		>
	</div>`,
	imports: [RouterModule, MatButtonModule]
})
export class NotImplementedComponent {
	constructor(private _location: Location) {}

	goBack() {
		this._location.back();
	}
}
