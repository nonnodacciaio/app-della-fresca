import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DocumentData } from "firebase/firestore";
import { Subject, takeUntil } from "rxjs";
import { Game, GamesService } from "../services/games.service";

@Component({
	selector: "game",
	standalone: true,
	template: `@if (game) {
		<h1 class="text-center">Giocata del {{ game.date?.toDate() | date : "dd/MM/yyy" || "Caricamento" }}</h1>
		<h3>Vincita: {{ game.result }}€</h3>

		} @else {Non è stato possibile recuperare i dati della giocata}`,
	imports: [CommonModule]
})
export class GameComponent implements OnInit, OnDestroy {
	id = "";
	game: Game | undefined;
	destroy$ = new Subject();

	constructor(private service: GamesService, private route: ActivatedRoute) {
		this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
			this.id = params["id"];
		});
	}

	ngOnInit(): void {
		this.service
			.getGame(this.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (result: DocumentData) => (this.game = result[0] as Game),
				error: (error: Response) => console.log(error.statusText)
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next(null);
		this.destroy$.unsubscribe();
	}
}
