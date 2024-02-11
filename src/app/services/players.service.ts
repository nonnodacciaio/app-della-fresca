import { Injectable, inject } from "@angular/core";
import { DocumentData, Firestore, collection, collectionData } from "@angular/fire/firestore";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class PlayersService {
	players$: Observable<DocumentData>;
	firestore: Firestore = inject(Firestore);

	constructor() {
		const itemCollection = collection(this.firestore, "players");
		this.players$ = collectionData(itemCollection);
	}
}

export interface Player {
	email: string;
	username: string;
}
