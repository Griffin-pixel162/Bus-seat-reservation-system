
document.addEventListener("DOMContentLoaded", () => {
  fetchTickets(); 
});


document.getElementById("ticket-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  try {
      const name = document.getElementById("name").value.trim();
      const seat = document.getElementById("seat").value.trim();
      const date = document.getElementById("date").value;
      const from = document.getElementById("from").value.trim();
      const to = document.getElementById("to").value.trim();

      
      if (!name || !seat || !date || !from || !to) {
          throw new Error("All fields are required");
      }
      if (from.toLowerCase() === to.toLowerCase()) {
          throw new Error("Departure and destination cannot be the same");
      }
      fetchTickets();
      const ticketId = "T" + Math.floor(Math.random() * 10000).toString().padStart(4, "0");
      const ticket = { ticketId, name, seat, date, from, to };
    //   https://br-liard-omega.vercel.app/tickets
      
      const response = await fetch("https://br-liard-omega.vercel.app/tickets", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(ticket)
        });
        event.target.reset();
        alert(`Ticket ${ticketId} booked successfully`);
        fetchTickets(); 

      if (!response.ok) {
          throw new Error("Error");
      }
      


  } catch (error) {
      alert( "Failed to book ticket");
  }
});


document.getElementById("history-table-body").addEventListener("click", async function(event) {
  if (event.target.classList.contains("delete-btn")) {
      const ticketId = event.target.getAttribute("data-ticket-id");
      try {
          const response = await fetch(`https://br-liard-omega.vercel.app/tickets/${ticketId}`, {
              method: "DELETE"
          });

          if (!response.ok) {
              throw new ticketId("Book");
          }

          alert(`Ticket ${ticketId} deleted`);
          fetchTickets();
      } catch (error) {
          alert("Failed to delete ticket");
      }
  }
});


document.getElementById("filter-input").addEventListener("input", function(event) {
  const searchTerm = event.target.value.toLowerCase();
  fetchTickets(searchTerm);
});


async function fetchTickets(filter = "") {
  try {
      const response = await fetch(`https://br-liard-omega.vercel.app/tickets${filter ? `?name_like=${filter}` : ""}`);
      if (!response.ok) {
          throw new Error("Failed to fetch tickets");
      }
      const tickets = await response.json();
      renderTickets(tickets);
  } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to load tickets");
  }
}

// ticketDiv.querySelector(".delete-btn").addEventListener("click", () => deleteTicket(ticketDiv, ticket.id));


function renderTickets(ticketArray) {
  const tableBody = document.getElementById("history-table-body");
  tableBody.innerHTML = "";
  ticketArray.forEach(ticket => {
      const row = tableBody.insertRow();
      row.innerHTML = `
          <td>${ticket.id || ticket.ticketId}</td>
          <td>${escapeHtml(ticket.name)}</td>
          <td>${escapeHtml(ticket.seat)}</td>
          <td>${escapeHtml(ticket.date)}</td>
          <td>${escapeHtml(ticket.from)}</td>
          <td>${escapeHtml(ticket.to)}</td>
          <td><button class="delete-btn" data-ticket-id="${ticket.id || ticket.ticketId}">Delete</button></td>
      `;
  });
}


function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
}