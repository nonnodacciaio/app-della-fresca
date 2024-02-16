import { Injectable, inject } from "@angular/core";
import { Firestore, collection } from "@angular/fire/firestore";
import { addDoc, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { from } from "rxjs";

@Injectable({ providedIn: "root" })
export class PlayersService {
	private firestore: Firestore = inject(Firestore);

	collectionRef = collection(this.firestore, "players");

	getAll() {
		return from(getDocs(this.collectionRef));
	}

	get(id: string) {
		return from(getDoc(doc(this.collectionRef, id)));
	}

	create(player: Player) {
		return from(addDoc(this.collectionRef, player));
	}

	update(id: string, data: any) {
		return updateDoc(doc(this.collectionRef, id), data);
	}

	delete(id: string) {
		return deleteDoc(doc(this.collectionRef, id));
	}
}

export interface Player {
	id?: string;
	email?: string;
	username?: string;
}
