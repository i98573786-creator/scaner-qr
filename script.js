let items = JSON.parse(localStorage.getItem("items")) || [];
let scannedCode = "";
let scanner = null;

// Завантаження
window.onload = () => {
    loadTheme();
    renderItems();
};

// Запуск сканера
function startScan() {

    document.getElementById("reader").innerHTML = "";

    scanner = new Html5Qrcode("reader");

    scanner.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        (decodedText) => {

            scannedCode = decodedText;

            alert("✅ Код успішно відскановано:\n\n" + decodedText);

            scanner.stop();

        },
        () => {}
    );

}

// Зберегти
function saveItem() {

    const name = document.getElementById("name").value.trim();
    const count = Number(document.getElementById("count").value);
    const description = document.getElementById("description").value.trim();

    if (!name) {
        alert("Введіть назву.");
        return;
    }

    if (count <= 0) {
        alert("Вкажіть кількість.");
        return;
    }

    items.push({
        id: Date.now(),
        code: scannedCode,
        name,
        count,
        description
    });

    localStorage.setItem("items", JSON.stringify(items));

    document.getElementById("name").value = "";
    document.getElementById("count").value = "";
    document.getElementById("description").value = "";

    scannedCode = "";

    renderItems();

    alert("✅ Збережено!");

              }
// Відображення товарів
function renderItems() {

    const search = document.getElementById("search").value.toLowerCase();

    const list = document.getElementById("list");

    list.innerHTML = "";

    let total = 0;

    let filtered = items.filter(item =>

        item.name.toLowerCase().includes(search) ||
        item.code.toLowerCase().includes(search)

    );

    filtered.forEach(item => {

        total += item.count;

        list.innerHTML += `
        <div class="item">

            <h3>${item.name}</h3>

            <p><b>Код:</b> ${item.code || "Немає"}</p>

            <p><b>Кількість:</b> ${item.count}</p>

            <p>${item.description || ""}</p>

            <div class="item-buttons">

                <button onclick="editItem(${item.id})">
                    ✏️ Редагувати
                </button>

                <button onclick="deleteItem(${item.id})">
                    🗑 Видалити
                </button>

            </div>

        </div>
        `;

    });

    document.getElementById("stats").innerHTML =
        `📦 Позицій: ${filtered.length}<br>📊 Всього одиниць: ${total}`;

}

// Видалення
function deleteItem(id){

    if(!confirm("Видалити цей запис?"))
        return;

    items = items.filter(item => item.id !== id);

    localStorage.setItem(
        "items",
        JSON.stringify(items)
    );

    renderItems();

}
// Редагування
function editItem(id) {

    const item = items.find(i => i.id === id);

    if (!item) return;

    const newName = prompt("Назва:", item.name);
    if (newName === null) return;

    const newCount = prompt("Кількість:", item.count);
    if (newCount === null) return;

    const newDescription = prompt("Опис:", item.description);

    item.name = newName;
    item.count = Number(newCount);
    item.description = newDescription;

    localStorage.setItem("items", JSON.stringify(items));

    renderItems();

}

// Перемикання теми
function toggleTheme() {

    document.body.classList.toggle("light");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light")
            ? "light"
            : "dark"
    );

}

// Завантаження теми
function loadTheme() {

    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
    }

}

// Експорт CSV
function exportCSV() {

    let csv = "Назва,Код,Кількість,Опис\n";

    items.forEach(item => {

        csv += `"${item.name}","${item.code}","${item.count}","${item.description}"\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "qr-storage.csv";

    link.click();

}
