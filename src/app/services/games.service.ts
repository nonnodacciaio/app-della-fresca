import { Injectable, inject } from "@angular/core";
import { DocumentData, DocumentReference, Firestore, Timestamp, collection, collectionData, docData } from "@angular/fire/firestore";
import { Observable, TimestampProvider, from, map } from "rxjs";
import { Player } from "./players.service";
import { doc, getDocs, query, where } from "firebase/firestore";

@Injectable({ providedIn: "root" })
export class GamesService {
	games$: Observable<DocumentData>;
	firestore: Firestore = inject(Firestore);

	constructor() {
		const itemCollection = collection(this.firestore, "games");
		this.games$ = collectionData(itemCollection).pipe(
			map((games: any[]) => {
				return games.map((game: any) => ({
					id: game.id,
					date: game.date,
					playersData: game.playersData,
					result: game.result
				}));
			})
		);
	}

	getGame(id: string): Observable<DocumentData> {
		return from(
			getDocs(query(collection(this.firestore, "games"), where("id", "==", id))).then(querySnapshot => {
				return querySnapshot.docs.map(doc => doc.data());
			})
		);
	}
}

export interface Game {
	id: string;
	date?: Timestamp;
	playersData?: PlayerData[];
	result?: number;
}

export interface PlayerData {
	player: DocumentReference;
	bet: number;
}
