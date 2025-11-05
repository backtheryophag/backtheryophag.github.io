// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();

// Данные приложения
let appData = {
    writeOff: [],
    ordering: [],
    todo: []
};

// Загрузка данных из localStorage
function loadData() {
    const saved = localStorage.getItem('materialsAppData');
    if (saved) {
        appData = JSON.parse(saved);
    }
    renderAll();
}

// Сохранение данных в localStorage
function saveData() {
    localStorage.setItem('materialsAppData', JSON.stringify(appData));
}

// Переключение вкладок
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Убираем активный класс у всех кнопок
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем активный класс текущей кнопке
        button.classList.add('active');
        
        // Скрываем все вкладки
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Показываем выбранную вкладку
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Добавление материала для списания
function addWriteOff() {
    const name = document.getElementById('write-off-name').value.trim();
    const quantity = document.getElementById('write-off-quantity').value;
    const purpose = document.getElementById('write-off-purpose').value.trim();
    
    if (!name || !quantity || !purpose) {
        showAlert('Заполните все поля');
        return;
    }
    
    const material = {
        id: Date.now(),
        name,
        quantity: parseInt(quantity),
        purpose,
        date: new Date().toLocaleDateString('ru-RU')
    };
    
    appData.writeOff.push(material);
    saveData();
    renderWriteOffList();
    clearWriteOffForm();
    showAlert('Материал добавлен в список списания');
}

// Добавление материала для заказа
function addOrdering() {
    const name = document.getElementById('ordering-name').value.trim();
    const quantity = document.getElementById('ordering-quantity').value;
    const purpose = document.getElementById('ordering-purpose').value.trim();
    
    if (!name || !quantity || !purpose) {
        showAlert('Заполните все поля');
        return;
    }
    
    const material = {
        id: Date.now(),
        name,
        quantity: parseInt(quantity),
        purpose,
        date: new Date().toLocaleDateString('ru-RU')
    };
    
    appData.ordering.push(material);
    saveData();
    renderOrderingList();
    clearOrderingForm();
    showAlert('Материал добавлен в список заказа');
}

// Добавление задачи
function addTodo() {
    const task = document.getElementById('todo-task').value.trim();
    
    if (!task) {
        showAlert('Введите описание задачи');
        return;
    }
    
    const todo = {
        id: Date.now(),
        task,
        completed: false,
        date: new Date().toLocaleDateString('ru-RU')
    };
    
    appData.todo.push(todo);
    saveData();
    renderTodoList();
    clearTodoForm();
    showAlert('Задача добавлена');
}

// Удаление материала для списания
function removeWriteOff(id) {
    appData.writeOff = appData.writeOff.filter(item => item.id !== id);
    saveData();
    renderWriteOffList();
}

// Удаление материала для заказа
function removeOrdering(id) {
    appData.ordering = appData.ordering.filter(item => item.id !== id);
    saveData();
    renderOrderingList();
}

// Удаление задачи
function removeTodo(id) {
    appData.todo = appData.todo.filter(item => item.id !== id);
    saveData();
    renderTodoList();
}

// Переключение статуса задачи
function toggleTodo(id) {
    const todo = appData.todo.find(item => item.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveData();
        renderTodoList();
    }
}

// Очистка формы списания
function clearWriteOffForm() {
    document.getElementById('write-off-name').value = '';
    document.getElementById('write-off-quantity').value = '';
    document.getElementById('write-off-purpose').value = '';
}

// Очистка формы заказа
function clearOrderingForm() {
    document.getElementById('ordering-name').value = '';
    document.getElementById('ordering-quantity').value = '';
    document.getElementById('ordering-purpose').value = '';
}

// Очистка формы задач
function clearTodoForm() {
    document.getElementById('todo-task').value = '';
}

// Рендеринг списка списания
function renderWriteOffList() {
    const container = document.getElementById('write-off-list');
    
    if (appData.writeOff.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div>📝</div>
                <p>Нет материалов для списания</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appData.writeOff.map(material => `
        <div class="item">
            <div class="item-header">
                <div class="item-name">${material.name}</div>
                <div class="item-quantity">${material.quantity} шт</div>
            </div>
            <div class="item-purpose">${material.purpose}</div>
            <div class="item-actions">
                <button class="btn-small btn-danger" onclick="removeWriteOff(${material.id})">
                    Удалить
                </button>
            </div>
            <div style="font-size: 0.8rem; color: var(--tg-theme-hint-color); margin-top: 5px;">
                Добавлено: ${material.date}
            </div>
        </div>
    `).join('');
}

// Рендеринг списка заказа
function renderOrderingList() {
    const container = document.getElementById('ordering-list');
    
    if (appData.ordering.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div>📦</div>
                <p>Нет материалов для заказа</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appData.ordering.map(material => `
        <div class="item">
            <div class="item-header">
                <div class="item-name">${material.name}</div>
                <div class="item-quantity">${material.quantity} шт</div>
            </div>
            <div class="item-purpose">${material.purpose}</div>
            <div class="item-actions">
                <button class="btn-small btn-danger" onclick="removeOrdering(${material.id})">
                    Удалить
                </button>
            </div>
            <div style="font-size: 0.8rem; color: var(--tg-theme-hint-color); margin-top: 5px;">
                Добавлено: ${material.date}
            </div>
        </div>
    `).join('');
}

// Рендеринг списка задач
function renderTodoList() {
    const container = document.getElementById('todo-list');
    
    if (appData.todo.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div>✅</div>
                <p>Нет задач</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appData.todo.map(todo => `
        <div class="todo-item">
            <input type="checkbox" class="todo-checkbox" 
                   ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <div class="todo-text ${todo.completed ? 'completed' : ''}">
                ${todo.task}
            </div>
            <button class="btn-small btn-danger" onclick="removeTodo(${todo.id})">
                ✕
            </button>
        </div>
    `).join('');
}

// Рендеринг всех списков
function renderAll() {
    renderWriteOffList();
    renderOrderingList();
    renderTodoList();
}

// Показать уведомление
function showAlert(message) {
    // В реальном приложении можно использовать Telegram Web App уведомления
    alert(message);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Добавляем обработчики Enter для форм
    document.getElementById('write-off-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addWriteOff();
    });
    
    document.getElementById('ordering-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addOrdering();
    });
    
    document.getElementById('todo-task').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTodo();
    });
});
