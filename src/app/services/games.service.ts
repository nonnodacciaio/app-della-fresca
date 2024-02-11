import { Injectable, inject } from "@angular/core";
import { DocumentData, DocumentReference, Firestore, Timestamp, collection, collectionData } from "@angular/fire/firestore";
import { Observable, TimestampProvider } from "rxjs";
import { Player } from "./players.service";

@Injectable({ providedIn: "root" })
export class GamesService {
	games$: Observable<DocumentData>;
	firestore: Firestore = inject(Firestore);

	constructor() {
		const itemCollection = collection(this.firestore, "games");
		this.games$ = collectionData(itemCollection);
	}
}

export interface Game {
	date: Timestamp;
	playersData: PlayerData[];
	result: number;
}

export interface PlayerData {
	player: DocumentReference;
	bet: number;
}
