import { CommonModule } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogModule, MatDialogTitle } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { FirebaseError } from "firebase/app";
import { Subject, takeUntil } from "rxjs";
import { Game, GamesService } from "../services/games.service";
import { Player, PlayersService } from "../services/players.service";
import { ToolbarService } from "../services/toolbar.service";

@Component({
	selector: "game",
	standalone: true,
	template: `@if (game) {
		<mat-table [dataSource]="dataSource">
			<ng-container matColumnDef="player">
				<mat-header-cell *matHeaderCellDef> Giocatore </mat-header-cell>
				<mat-cell *matCellDef="let element">
					{{ element.username || "Caricamento..." }}
				</mat-cell>
			</ng-container>

			<ng-container matColumnDef="bet">
				<mat-header-cell *matHeaderCellDef> Puntata </mat-header-cell>
				<mat-cell *matCellDef="let element"> {{ element.bet }}€ </mat-cell>
			</ng-container>

			<ng-container matColumnDef="winning">
				<mat-header-cell *matHeaderCellDef> Vincita </mat-header-cell>
				<mat-cell *matCellDef="let element"> {{ element.winnings }}€ </mat-cell>
			</ng-container>

			<mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
			<mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
		</mat-table>
		<div class="flex m-4 justify-end space-x-2">
			<button
				mat-raised-button
				(click)="editTotalWinningsDialog()"
				color="primary">
				<mat-icon>edit</mat-icon> Modifica vincita totale
			</button>

			<button
				mat-raised-button
				(click)="deleteGame()"
				color="warn">
				<mat-icon>delete</mat-icon> Elimina la giocata
			</button>
		</div>
		} @else {Non è stato possibile recuperare i dati della giocata}`,
	styles: [
		`
			mat-header-row,
			mat-row {
				background-color: #1a202c;
				color: #cbd5e0;
			}
		`
	],
	imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule]
})
export class GameComponent implements OnInit, OnDestroy {
	id = "";
	game?: Game;
	players: Player[] = [];
	dataSource = new MatTableDataSource<PlayerDataInfo>();
	displayedColumns: string[] = ["player", "bet", "winning"];
	destroy$ = new Subject();

	constructor(
		private gamesService: GamesService,
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
		private toolbarService: ToolbarService,
		private playersService: PlayersService,
		private router: Router
	) {
		this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
			this.id = params["id"];
		});
	}

	ngOnInit(): void {
		this.getGame();
	}

	ngOnDestroy(): void {
		this.destroy$.next(null);
		this.destroy$.unsubscribe();
	}

	private refreshGames() {
		this.dataSource.data = [];
	}

	private getGame() {
		this.gamesService
			.get(this.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: result => {
					this.game = { id: result.id, ...result.data() };
					this.toolbarService.toolbarText = `Giocata del ${this.game?.date?.toDate().toLocaleDateString("it-it", { day: "2-digit", month: "2-digit", year: "numeric" })}`;
				},
				error: (error: FirebaseError) => console.error(error),
				complete: () => this.getPlayersData()
			});
	}

	private toPlayerDataInfo() {
		this.dataSource.data =
			this.game?.playersData?.map(playerData => {
				const player = this.players.find(p => p.id == playerData.playerRef.id);
				const playerDataInfo: PlayerDataInfo = {
					playerId: player?.id,
					username: player?.username,
					bet: playerData.bet,
					winnings: this.getWinningAmount(playerData.bet)
				};
				return playerDataInfo;
			}) ?? [];

		this.addTotalsRow();
	}

	private getPlayersData() {
		this.game?.playersData?.forEach(playerData => {
			if (playerData && playerData.playerRef && playerData.playerRef.id) {
				this.playersService
					.get(playerData.playerRef.id)
					.pipe(takeUntil(this.destroy$))
					.subscribe({
						next: result => this.players.push({ id: result.id, ...result.data() }),
						error: (error: FirebaseError) => console.error(error),
						complete: () => this.toPlayerDataInfo()
					});
			}
		});
	}

	getWinningAmount(bet: number) {
		if (!bet) {
			return;
		}
		const totalBets = this.game?.playersData?.reduce((acc, player) => acc + player.bet, 0);

		if (totalBets) {
			return (bet / totalBets) * (this.game?.result ?? 0);
		}

		return;
	}

	editTotalWinningsDialog() {
		const dialogRef = this.dialog.open(EditTotalWinningsDialog, { data: { totalWinnings: this.game?.result } });

		dialogRef.afterClosed().subscribe((result: number) => {
			if (result < 0) {
				this.snackBar.open("Sei un brocco", "", { duration: 5e3 });
				return;
			}

			if (result && this.game) {
				this.game.result = result;
				this.gamesService
					.update(this.id, this.game)
					.pipe(takeUntil(this.destroy$))
					.subscribe({
						error: (error: FirebaseError) => console.log(error),
						next: () => this.getGame()
					});
			}
		});
	}

	private addTotalsRow() {
		const totalBet = this.dataSource.data.reduce((acc, player) => acc + (player.bet ?? 0), 0) ?? 0;
		const totalWinning = this.game?.result ?? 0;
		this.dataSource.data = [...this.dataSource.data, { playerId: null, username: "Totale", bet: totalBet, winnings: totalWinning }];
	}

	deleteGame() {
		const res = confirm("Sei sicuro di voler eliminare questa giocata?");

		if (!res) return;

		this.gamesService
			.delete(this.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => this.router.navigate(["/"]),
				error: (error: FirebaseError) => this.snackBar.open(`Errore durante l'eliminazione della giocata: ${error.message}`, "Chiudi")
			});
	}
}

interface PlayerDataInfo {
	playerId?: string | null;
	username?: string;
	bet?: number;
	winnings?: number;
}

@Component({
	selector: "edit-total-winnings-dialog",
	template: `<h2 mat-dialog-title>Modifica vincita totale</h2>
		<mat-dialog-content
			><mat-form-field
				><input
					[value]="data.totalWinnings"
					(input)="changeTotalWinnings($event.target)"
					matInput
					type="number" /></mat-form-field
			><button
				mat-icon-button
				color="accent"
				[mat-dialog-close]="newTotalWinnings">
				<mat-icon>done</mat-icon>
			</button></mat-dialog-content
		> `,
	standalone: true,
	imports: [MatDialogModule, MatButtonModule, MatInputModule, MatDialogTitle, MatDialogContent, MatIconModule]
})
export class EditTotalWinningsDialog {
	newTotalWinnings: number | undefined;

	constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

	changeTotalWinnings(event: any) {
		this.newTotalWinnings = event.value;
	}
}

interface DialogData {
	totalWinnings: number;
}
