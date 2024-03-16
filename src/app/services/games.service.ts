import { Injectable, inject } from "@angular/core";
import { Firestore, Timestamp, collection } from "@angular/fire/firestore";
import { DocumentReference, addDoc, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { from } from "rxjs";

@Injectable({ providedIn: "root" })
export class GamesService {
	private firestore: Firestore = inject(Firestore);

	collectionRef = collection(this.firestore, "games");

	getAll() {
		return from(getDocs(this.collectionRef));
	}

	get(id: string) {
		return from(getDoc(doc(this.collectionRef, id)));
	}

	create(game: Game) {
		return from(addDoc(this.collectionRef, game));
	}

	update(id: string, data: any) {
		return from(updateDoc(doc(this.collectionRef, id), data));
	}

	delete(id: string) {
		return from(deleteDoc(doc(this.collectionRef, id)));
	}
}

export interface Game {
	id?: string;
	date?: Timestamp;
	playersData?: PlayerData[];
	result?: number;
}

export interface PlayerData {
	playerRef: DocumentReference;
	bet: number;
}
