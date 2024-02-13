import { CommonModule } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { DocumentData } from "firebase/firestore";
import { Subject, takeUntil } from "rxjs";
import { Game, GamesService, PlayerData } from "../services/games.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogModule, MatDialogTitle } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { FirebaseError } from "firebase/app";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

@Component({
	selector: "game",
	standalone: true,
	template: `@if (game) {
		<h1 class="text-center">Giocata del {{ game.date?.toDate() | date : "dd/MM/yyy" || "Caricamento..." }}</h1>
		<h3>Pagina work in progress</h3>
		<h3>Se volete testare fate pure, ma ASSOLUTAMENTE non mettete mai un numero negativo se modificate la vincita totale</h3>
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
		<div class="flex m-4">
			<button
				mat-raised-button
				(click)="editTotalWinningsDialog()"
				class="ml-auto"
				color="primary">
				<mat-icon>edit</mat-icon> Modifica vincita totale
			</button>
		</div>
		} @else {Non è stato possibile recuperare i dati della giocata}`,
	imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule]
})
export class GameComponent implements OnInit, OnDestroy {
	id = "";
	game: Game | undefined;
	dataSource = new MatTableDataSource<PlayerDataInfo>();
	displayedColumns: string[] = ["player", "bet", "winning"];
	destroy$ = new Subject();

	constructor(private gamesService: GamesService, private route: ActivatedRoute, private dialog: MatDialog, private snackBar: MatSnackBar) {
		this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
			this.id = params["id"];
		});
	}

	ngOnInit(): void {
		this.refreshGames();
	}

	ngOnDestroy(): void {
		this.destroy$.next(null);
		this.destroy$.unsubscribe();
	}

	private refreshGames() {
		this.dataSource.data = [];
		this.gamesService
			.getGame(this.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (result: DocumentData) => {
					this.game = result[0] as Game;
					this.dataSource.data = this.toPlayerDataInfo(this.game?.playersData);
					this.addTotalsRow();
				},
				error: (error: Response) => console.log(error.statusText)
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
				this.gamesService
					.updateGameResult(this.id, result)
					.pipe(takeUntil(this.destroy$))
					.subscribe({
						error: (error: FirebaseError) => console.log(error),
						next: () => {
							this.refreshGames();
						}
					});
			}
		});
	}

	private toPlayerDataInfo(playerData?: PlayerData[]): PlayerDataInfo[] {
		if (!playerData) return [];

		return playerData.map(player => new PlayerDataInfo(player.playerId, player.username, player.bet, this.getWinningAmount(player.bet) ?? 0));
	}

	private addTotalsRow() {
		const totalBet = this.dataSource.data.reduce((acc, player) => acc + player.bet, 0) ?? 0;
		const totalWinning = this.game?.result ?? 0;
		this.dataSource.data = [...this.dataSource.data, new PlayerDataInfo(null, "Totale", totalBet, totalWinning)];
	}
}

class PlayerDataInfo implements PlayerData {
	playerId: string | null;
	username: string;
	bet: number;
	winnings: number;

	constructor(playerId: string | null, username: string, bet: number, winnings: number) {
		this.playerId = playerId;
		this.username = username;
		this.bet = bet;
		this.winnings = winnings;
	}
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
