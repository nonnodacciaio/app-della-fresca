import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { FirebaseError } from "firebase/app";
import { Subject, takeUntil } from "rxjs";
import { Game, GamesService } from "../services/games.service";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "games-list",
	standalone: true,
	template: ` <h3 class="text-center">Lista giocate</h3>
		<div class="flex justify-center flex-col">
			@for (game of games; track $index) {
			<div class="flex items-center justify-center">
				<a
					mat-button
					[routerLink]="'/game/' + game.id"
					color="accent"
					>{{ game.date?.toDate() | date : "dd/MM/yyyy" }}</a
				><button
					mat-icon-button
					(click)="deleteGame(game.id)"
					color="warn">
					<mat-icon>delete</mat-icon>
				</button>
			</div>
			} @empty {Non ci sono giocate da visualizzare}
		</div>`,
	imports: [CommonModule, MatButtonModule, RouterModule, MatIconModule]
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
		this.games = [];
		this.service
			.getAll()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: result => result.forEach(doc => this.games.push({ id: doc.id, ...doc.data() })),
				error: (error: FirebaseError) => console.error(error),
				complete: () => this.games.sort((a, b) => ((a.date?.toDate() ?? 0) > (b.date?.toDate() ?? 0) ? -1 : 1))
			});
	}

	deleteGame(id: string | undefined) {
		if (!id) return;

		const res = confirm("Sei sicuro di voler eliminare questa giocata?");

		if (!res) return;

		this.service
			.delete(id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({ next: () => this.getGames(), error: (error: FirebaseError) => console.error(error) });
	}
}
