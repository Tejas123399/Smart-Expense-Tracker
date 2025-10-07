const form = document.getElementById("expenseForm");
const tableBody = document.querySelector("#expenseTable tbody");
const totalAmountEl = document.getElementById("totalAmount");
const filterCategory = document.getElementById("filterCategory");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function updateLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function calculateTotal() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  totalAmountEl.textContent = total.toFixed(2);
}

function renderTable() {
  tableBody.innerHTML = "";
  const selectedFilter = filterCategory.value;

  expenses
    .filter(e => selectedFilter === "All" || e.category === selectedFilter)
    .forEach((expense, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${expense.name}</td>
        <td>${expense.amount.toFixed(2)}</td>
        <td>${expense.category}</td>
        <td>${expense.date}</td>
        <td class="actions">
          <button class="edit" onclick="editExpense(${index})">Edit</button>
          <button class="delete" onclick="deleteExpense(${index})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

  calculateTotal();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("expenseName").value.trim();
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const category = document.getElementById("expenseCategory").value;
  const date = new Date().toLocaleDateString();

  if (!name || isNaN(amount) || !category) {
    alert("Please fill all fields correctly!");
    return;
  }

  expenses.push({ name, amount, category, date });
  updateLocalStorage();
  renderTable();
  form.reset();
});

function deleteExpense(index) {
  if (confirm("Delete this expense?")) {
    expenses.splice(index, 1);
    updateLocalStorage();
    renderTable();
  }
}

function editExpense(index) {
  const expense = expenses[index];
  const newName = prompt("Edit name:", expense.name);
  const newAmount = prompt("Edit amount:", expense.amount);
  const newCategory = prompt("Edit category:", expense.category);

  if (newName && newAmount && newCategory) {
    expenses[index] = { ...expense, name: newName, amount: parseFloat(newAmount), category: newCategory };
    updateLocalStorage();
    renderTable();
  }
}

filterCategory.addEventListener("change", renderTable);

// Initial render
renderTable();
