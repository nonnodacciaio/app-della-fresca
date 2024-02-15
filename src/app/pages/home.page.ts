import { Component, OnDestroy } from "@angular/core";
import { GamesListComponent } from "../components/games-list.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ToolbarService } from "../services/toolbar.service";
import { MatDialog, MatDialogContent, MatDialogModule, MatDialogTitle } from "@angular/material/dialog";
import { FirebaseError } from "firebase/app";
import { Subject, takeUntil } from "rxjs";
import { EditTotalWinningsDialog } from "../components/game.component";
import { Game, GamesService } from "../services/games.service";
import { MatInputModule } from "@angular/material/input";
import { documentId } from "firebase/firestore";

@Component({
	selector: "home",
	standalone: true,
	imports: [GamesListComponent, MatButtonModule, MatIconModule],
	template: `
		<div class="flex justify-center m-4">
			<button
				mat-raised-button
				color="primary"
				(click)="addGame()">
				<mat-icon>add</mat-icon>Balla la fresca
			</button>
		</div>
		<games-list></games-list>
	`
})
export class HomePage implements OnDestroy {
	destroy$ = new Subject();

	constructor(private toolbarService: ToolbarService, private gamesService: GamesService, private dialog: MatDialog) {
		this.toolbarService.toolbarText = "App della fresca";
	}

	ngOnDestroy(): void {
		this.destroy$.next(null);
		this.destroy$.complete();
	}

	addGame() {
		const dialogRef = this.dialog.open(AddGameDialog);

		dialogRef.afterClosed().subscribe(() => console.log("Dialog closed"));
	}
}

@Component({
	selector: "add-game",
	standalone: true,
	template: `<h2 mat-dialog-title>Aggiungi una giocata</h2>
		<mat-dialog-content
			>Work in progress<button
				mat-icon-button
				color="accent"
				[mat-dialog-close]="">
				<mat-icon>add</mat-icon>
			</button></mat-dialog-content
		>`,
	imports: [MatDialogModule, MatButtonModule, MatInputModule, MatDialogTitle, MatDialogContent, MatIconModule]
})
export class AddGameDialog {
	game: Game = {};
}
