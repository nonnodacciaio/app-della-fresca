import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { Player, PlayersService } from "../services/players.service";

@Component({
	selector: "players-list",
	standalone: true,
	template: `@for(player of players; track $index) {
		{{ player.username }}
		} @empty { Non ci sono giocatori da visualizzare }`
})
export class PlayersListComponent implements OnInit, OnDestroy {
	players: Player[] = [];
	destroy$ = new Subject();

	constructor(private service: PlayersService) {}

	ngOnInit(): void {
		this.getPlayers();
	}

	ngOnDestroy(): void {
		this.destroy$.next(null);
		this.destroy$.unsubscribe();
	}

	getPlayers() {
		this.service.players$.pipe(takeUntil(this.destroy$)).subscribe(players => (this.players = players as Player[]));
	}
}
