import { Injectable, inject } from "@angular/core";
import { DocumentData, Firestore, Timestamp, collection, collectionData } from "@angular/fire/firestore";
import { getDocs, query, where } from "firebase/firestore";
import { Observable, from, map } from "rxjs";

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
	playerId: string | null;
	username: string;
	bet: number;
}
