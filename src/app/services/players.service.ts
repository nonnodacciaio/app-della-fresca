import { Injectable, inject } from "@angular/core";
import { DocumentData, Firestore, collection, collectionData, getDocs, query, where } from "@angular/fire/firestore";
import { Observable, from } from "rxjs";

@Injectable({ providedIn: "root" })
export class PlayersService {
	players$: Observable<DocumentData>;
	firestore: Firestore = inject(Firestore);

	constructor() {
		const itemCollection = collection(this.firestore, "players");
		this.players$ = collectionData(itemCollection);
	}

	getPlayer(id: string): Observable<DocumentData> {
		console.log(id);
		return from(
			getDocs(query(collection(this.firestore, "players"), where("id", "==", id))).then(querySnapshot => {
				return querySnapshot.docs.map(doc => doc.data());
			})
		);
	}

	// getPlayers(): Player[] {

	// }
}

export interface Player {
	id: string;
	email: string;
	username: string;
}
