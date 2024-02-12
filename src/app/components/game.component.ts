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
				<th
					mat-header-cell
					*matHeaderCellDef>
					Giocatore
				</th>
				<td
					mat-cell
					*matCellDef="let element">
					{{ element.username || "Caricamento..." }}
				</td>
			</ng-container>

			<ng-container matColumnDef="bet">
				<th
					mat-header-cell
					*matHeaderCellDef>
					Puntata
				</th>
				<td
					mat-cell
					*matCellDef="let element">
					{{ element.bet }}
				</td>
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
	dataSource = new MatTableDataSource<PlayerData>();
	displayedColumns: string[] = ["player", "bet"];
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
					this.dataSource.data = this.game?.playersData ?? [];
				},
				error: (error: Response) => console.log(error.statusText)
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next(null);
		this.destroy$.unsubscribe();
	}
}
