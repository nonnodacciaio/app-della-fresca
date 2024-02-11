import { Component, OnInit } from "@angular/core";
import { Game, GamesService } from "../services/games.service";
import { Subject, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";

@Component({
	selector: "games-list",
	standalone: true,
	template: ` <h3 class="text-center">Lista giocate</h3>
		<div class="flex justify-center">
			@for (game of games; track $index) {
			<a
				mat-button
				color="accent"
				routerLink="/not-implemented"
				>{{ game.date.toDate() | date : "dd/MM/yyyy" }}</a
			>
			} @empty {Non ci sono giocate da visualizzare}
		</div>`,
	imports: [CommonModule, MatButtonModule, RouterModule]
})
export class GamesListComponent implements OnInit {
	games: Game[] = [];
	destroy$ = new Subject();

	constructor(private service: GamesService) {}

	ngOnInit(): void {
		this.getGames();
	}

	ngOnDestroy(): void {
		this.destroy$.next(null);
		this.destroy$.unsubscribe();
	}

	getGames() {
		this.service.games$.pipe(takeUntil(this.destroy$)).subscribe(games => {
			this.games = games as Game[];
		});
	}
}
