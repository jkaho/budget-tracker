let db;

// Creates a new db request for a "budget" database
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
   // Creates object store called "pending" and sets autoIncrement to true
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  // Checks if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log("Oops! " + event.target.errorCode);
};

function saveRecord(record) {
  // Creates a transaction on the pending db with readwrite access
  const transaction = db.transaction(["pending"], "readwrite");

  // Accesses your pending object store
  const store = transaction.objectStore("pending");

  // Adds record to your store with add method
  store.add(record);
}

function checkDatabase() {
  // Opens a transaction on your pending db
  const transaction = db.transaction(["pending"], "readwrite");
  // Accesses your pending object store
  const store = transaction.objectStore("pending");
  // Gets all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        // If successful, open a transaction on your pending db
        const transaction = db.transaction(["pending"], "readwrite");

        // Accesses your pending object store
        const store = transaction.objectStore("pending");

        // Clears all items in your store
        store.clear();
      });
    }
  };
}

// Listens for app coming back online
window.addEventListener("online", checkDatabase);
