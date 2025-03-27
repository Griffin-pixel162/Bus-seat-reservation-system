// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  fetchTickets(); // Load initial tickets
});

// Form submission handler
document.getElementById("ticket-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  try {
      const name = document.getElementById("name").value.trim();
      const seat = document.getElementById("seat").value.trim();
      const date = document.getElementById("date").value;
      const from = document.getElementById("from").value.trim();
      const to = document.getElementById("to").value.trim();

      // Validation
      if (!name || !seat || !date || !from || !to) {
          throw new Error("All fields are required");
      }
      if (from.toLowerCase() === to.toLowerCase()) {
          throw new Error("Departure and destination cannot be the same");
      }

      const ticketId = "T" + Math.floor(Math.random() * 10000).toString().padStart(4, "0");
      const ticket = { ticketId, name, seat, date, from, to };

      // POST to json-server
      const response = await fetch("http://localhost:3000/tickets", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(ticket)
      });

      if (!response.ok) {
          throw new Error("Failed to book ticket");
      }

      event.target.reset();
      alert(`Ticket ${ticketId} booked successfully`);
      fetchTickets(); // Refresh ticket list

  } catch (error) {
      alert(error.message || "Failed to book ticket");
  }
});

// Delete handler
document.getElementById("history-table-body").addEventListener("click", async function(event) {
  if (event.target.classList.contains("delete-btn")) {
      const ticketId = event.target.getAttribute("data-ticket-id");
      try {
          const response = await fetch(`http://localhost:3000/tickets/${ticketId}`, {
              method: "DELETE"
          });

          if (!response.ok) {
              throw new Error("Failed to delete ticket");
          }

          alert(`Ticket ${ticketId} deleted`);
          fetchTickets(); // Refresh ticket list
      } catch (error) {
          alert("Failed to delete ticket");
      }
  }
});

// Filter handler
document.getElementById("filter-input").addEventListener("input", function(event) {
  const searchTerm = event.target.value.toLowerCase();
  fetchTickets(searchTerm); // Fetch with filter
});

// Fetch and render tickets
async function fetchTickets(filter = "") {
  try {
      const response = await fetch(`http://localhost:3000/tickets${filter ? `?name_like=${filter}` : ""}`);
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

// Render tickets to table
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

// HTML escape function
function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
}