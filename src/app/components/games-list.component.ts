import { Component, OnInit } from "@angular/core";
import { Game, GamesService } from "../services/games.service";
import { Subject, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { FirebaseError } from "firebase/app";

@Component({
	selector: "games-list",
	standalone: true,
	template: ` <h3 class="text-center">Lista giocate</h3>
		<div class="flex justify-center">
			@for (game of games; track $index) {
			<a
				mat-button
				[routerLink]="'/game/' + game.id"
				color="accent"
				>{{ game.date?.toDate() | date : "dd/MM/yyyy" }}</a
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
		this.service
			.getAll()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: result => result.forEach(doc => this.games.push({ id: doc.id, ...doc.data() })),
				error: (error: FirebaseError) => console.error(error)
			});
	}
}
