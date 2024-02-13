import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { DocumentData } from "firebase/firestore";
import { Subject, takeUntil } from "rxjs";
import { Game, GamesService, PlayerData } from "../services/games.service";

@Component({
	selector: "game",
	standalone: true,
	template: `@if (game) {
		<h1 class="text-center">Giocata del {{ game.date?.toDate() | date : "dd/MM/yyy" || "Caricamento..." }}</h1>
		<h3>Pagina work in progress</h3>
		<mat-table [dataSource]="dataSource">
			<ng-container matColumnDef="player">
				<mat-header-cell *matHeaderCellDef> Giocatore </mat-header-cell>
				<mat-cell *matCellDef="let element">
					{{ element.username || "Caricamento..." }}
				</mat-cell>
			</ng-container>

			<ng-container matColumnDef="bet">
				<mat-header-cell *matHeaderCellDef> Puntata </mat-header-cell>
				<mat-cell *matCellDef="let element">
					{{ element.bet }}
				</mat-cell>
			</ng-container>

			<ng-container matColumnDef="winning">
				<mat-header-cell *matHeaderCellDef> Vincita </mat-header-cell>
				<mat-cell *matCellDef="let element">
					{{ element.winnings }}
				</mat-cell>
			</ng-container>

			<mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
			<mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
		</mat-table>

		} @else {Non è stato possibile recuperare i dati della giocata}`,
	imports: [CommonModule, MatTableModule]
})
export class GameComponent implements OnInit, OnDestroy {
	id = "";
	game: Game | undefined;
	dataSource = new MatTableDataSource<PlayerDataInfo>();
	displayedColumns: string[] = ["player", "bet", "winning"];
	destroy$ = new Subject();

	constructor(private gamesService: GamesService, private route: ActivatedRoute) {
		this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
			this.id = params["id"];
		});
	}

	ngOnInit(): void {
		this.gamesService
			.getGame(this.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (result: DocumentData) => {
					this.game = result[0] as Game;
					this.dataSource.data = this.toPlayerDataInfo(this.game?.playersData) ?? [];
					this.addTotalsRow();
				},
				error: (error: Response) => console.log(error.statusText)
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next(null);
		this.destroy$.unsubscribe();
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

	private toPlayerDataInfo(playerData?: PlayerData[]): PlayerDataInfo[] {
		if (!playerData) return [];

		return playerData.map(player => new PlayerDataInfo(player.playerId, player.username, player.bet, this.getWinningAmount(player.bet) ?? 0));
	}

	private addTotalsRow() {
		const totalBet = this.dataSource.data.reduce((acc, player) => acc + player.bet, 0) ?? 0;
		const totalWinning = this.game?.result ?? 0;
		this.dataSource.data.push({ username: "Totale", bet: totalBet, playerId: null, winnings: totalWinning });
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
