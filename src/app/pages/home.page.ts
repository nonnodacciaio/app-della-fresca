import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogContent, MatDialogModule, MatDialogTitle } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { DocumentReference, Timestamp } from "firebase/firestore";
import { Subject, takeUntil } from "rxjs";
import { GamesListComponent } from "../components/games-list.component";
import { Game, GamesService } from "../services/games.service";
import { Player, PlayersService } from "../services/players.service";
import { ToolbarService } from "../services/toolbar.service";
import { FirebaseError } from "firebase/app";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";

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
		<games-list #gameslist></games-list>
	`
})
export class HomePage implements OnDestroy {
	@ViewChild("gameslist") gamesList: GamesListComponent | undefined;
	destroy$ = new Subject();

	constructor(private toolbarService: ToolbarService, private gamesService: GamesService, private dialog: MatDialog, private snackBar: MatSnackBar) {
		this.toolbarService.toolbarText = "App della fresca";
	}

	ngOnDestroy(): void {
		this.destroy$.next(null);
		this.destroy$.complete();
	}

	addGame() {
		const dialogRef = this.dialog.open(AddGameDialog);

		dialogRef.afterClosed().subscribe((result: Game) =>
			this.gamesService
				.create(result)
				.pipe(takeUntil(this.destroy$))
				.subscribe({ next: () => this.gamesList?.getGames(), error: (error: FirebaseError) => this.snackBar.open(`Errore durante la creazione di una nuova giocata: ${error.message}`, "Chiudi") })
		);
	}
}

@Component({
	selector: "add-game",
	standalone: true,
	template: `<h2 mat-dialog-title>Aggiungi una giocata</h2>
		<mat-dialog-content>
			<mat-form-field
				><mat-label>Aggiungi un giocatore</mat-label
				><input
					matInput
					[(ngModel)]="newPlayer" />
				@if (newPlayer) {
				<button
					matSuffix
					mat-icon-button
					(click)="addNewPlayer()">
					<mat-icon>check</mat-icon>
				</button>
				}</mat-form-field
			>
			<mat-form-field>
				<mat-label>Seleziona giocatori</mat-label
				><mat-select
					(selectionChange)="selectionChange($event)"
					multiple
					>@for(player of players; track player) {<mat-option [value]="player">{{ player.username }}</mat-option
					>}</mat-select
				></mat-form-field
			>
			@for(player of selectedPlayers; track player) {
			<div>
				{{ player.username }}
				<mat-form-field>
					<mat-label>Inserisci puntata</mat-label>
					<input
						matInput
						type="number"
						(input)="betChange($event, player)" />
				</mat-form-field>
			</div>
			}
			<div class="flex">
				<button
					class="ml-auto"
					mat-icon-button
					color="accent"
					[mat-dialog-close]="game">
					<mat-icon>add</mat-icon>
				</button>
			</div></mat-dialog-content
		>`,
	imports: [MatDialogModule, MatButtonModule, MatInputModule, MatDialogTitle, MatDialogContent, MatIconModule, MatSelectModule, FormsModule, MatFormFieldModule]
})
export class AddGameDialog implements OnInit, OnDestroy {
	game: Game = { date: Timestamp.now(), result: 0 };
	players: PlayerInfo[] = [];
	selectedPlayers: PlayerInfo[] = [];
	newPlayer = "";
	destroy$ = new Subject();

	constructor(public playersService: PlayersService, private snackBar: MatSnackBar) {}

	ngOnInit(): void {
		this.getPlayers();
	}

	ngOnDestroy(): void {}

	private getPlayers() {
		this.players = [];
		this.playersService
			.getAll()
			.pipe(takeUntil(this.destroy$))
			.subscribe(result => {
				result.docs.forEach(doc => {
					this.players.push({ id: doc.id, playerRef: doc.ref, ...(doc.data() as Player) });
				});
			});
	}

	selectionChange(event: MatSelectChange) {
		this.selectedPlayers = event.value;
		this.game.playersData = this.selectedPlayers.map(player => ({ playerRef: player.playerRef, bet: 0 }));
	}

	betChange(event: Event, player: PlayerInfo) {
		const input = event.target as HTMLInputElement;
		const bet = parseInt(input.value);
		const playerData = this.game?.playersData?.find(pd => pd.playerRef.id === player.id);
		if (playerData) {
			playerData.bet = bet;
		}
	}

	addNewPlayer() {
		if (this.newPlayer) {
			this.playersService
				.create({ username: this.newPlayer })
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					complete: () => {
						this.getPlayers();
						this.newPlayer = "";
					},
					error: (error: FirebaseError) => this.snackBar.open(`Errore durante la creazione di un nuovo giocatore: ${error.message}`, "Chiudi")
				});
		}
	}
}

interface PlayerInfo extends Player {
	playerRef: DocumentReference;
}
