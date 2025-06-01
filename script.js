import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCWPLTyQAkFL0xz_SOS3HDSOnTmixKdb2w",
  authDomain: "allxgaming-8059c.firebaseapp.com",
  databaseURL: "https://allxgaming-8059c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "allxgaming-8059c",
  storageBucket: "allxgaming-8059c.firebasestorage.app",
  messagingSenderId: "863325401401",
  appId: "1:863325401401:web:1c1179203cb3ca24bcb8e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let roomId = "";
let player = "";

function joinRoom() {
  roomId = document.getElementById("roomInput").value;
  if (!roomId) return alert("Room code required");

  const roomRef = ref(db, `rooms/${roomId}`);
  onValue(roomRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      // new room
      player = "player1";
      set(roomRef, { player1: null, player2: null });
    } else if (!data.player2) {
      player = "player2";
      set(ref(db, `rooms/${roomId}/player2`), null);
    } else {
      alert("Room full!");
      return;
    }

    document.getElementById("playerLabel").innerText = `You are: ${player}`;
    document.getElementById("gameSection").style.display = "block";

    watchMoves(roomRef);
  });
}

function makeMove(move) {
  const moveRef = ref(db, `rooms/${roomId}/${player}`);
  set(moveRef, move);
  document.getElementById("status").innerText = "Waiting for opponent's move...";
}

function watchMoves(roomRef) {
  onValue(roomRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.player1 && data.player2) {
      const result = getResult(data.player1, data.player2);
      document.getElementById("status").innerText = result;
    }
  });
}

function getResult(p1, p2) {
  if (p1 === p2) return "It's a tie!";
  if (
    (p1 === "rock" && p2 === "scissors") ||
    (p1 === "paper" && p2 === "rock") ||
    (p1 === "scissors" && p2 === "paper")
  ) {
    return player === "player1" ? "You Win!" : "You Lose!";
  } else {
    return player === "player2" ? "You Win!" : "You Lose!";
  }
}