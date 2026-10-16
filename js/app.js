// app.js — Todo List Life Dashboard
// Module structure: IIFE-based namespaces for each widget + App coordinator.
// Stub implementations will be filled in by subsequent tasks (Tasks 4–7).

'use strict';

// ---------------------------------------------------------------------------
// GreetingWidget — live clock, formatted date, and time-of-day greeting
// ---------------------------------------------------------------------------
const GreetingWidget = (() => {
  // Private DOM references (set in init)
  let _elGreeting = null;
  let _elTime = null;
  let _elDate = null;

  /**
   * Bind DOM elements and start 1-second interval.
   * Implements: Requirements 1.1, 1.2, 1.3, 2.1–2.5
   */
  function init() {
    _elGreeting = document.getElementById('greeting-text');
    _elTime = document.getElementById('time-display');
    _elDate = document.getElementById('date-display');
    _tick();
    setInterval(_tick, 1000);
  }

  /** Called every second — updates time display, date display, and greeting. */
  function _tick() {
    const now = new Date();
    if (_elTime) _elTime.textContent = _formatTime(now);
    if (_elDate) _elDate.textContent = _formatDate(now);
    if (_elGreeting) _elGreeting.textContent = _getGreeting(now.getHours());
  }

  /**
   * Format a Date object as HH:MM:SS with an AM/PM indicator (12-hour clock).
   * e.g. "09:05:32 AM"
   * @param {Date} date
   * @returns {string}
   */
  function _formatTime(date) {
    const rawHours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const period = rawHours < 12 ? 'AM' : 'PM';
    const hours12 = rawHours % 12 || 12; // convert 0 → 12 for midnight/noon
    const hh = String(hours12).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${hh}:${mm}:${ss} ${period}`;
  }

  /**
   * Format a Date object as "Weekday, DD Month YYYY".
   * e.g. "Monday, 14 July 2025"
   * @param {Date} date
   * @returns {string}
   */
  function _formatDate(date) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const weekday = weekdays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${weekday}, ${day} ${month} ${year}`;
  }

  /**
   * Return the time-of-day greeting phrase for the given hour (0–23).
   * 05–11 → "Good Morning"
   * 12–16 → "Good Afternoon"
   * 17–20 → "Good Evening"
   * 21–04 (wraps midnight) → "Good Night"
   * @param {number} hour
   * @returns {string}
   */
  function _getGreeting(hour) {
    if (hour >= 5 && hour <= 11) return 'Good Morning';
    if (hour >= 12 && hour <= 16) return 'Good Afternoon';
    if (hour >= 17 && hour <= 20) return 'Good Evening';
    return 'Good Night'; // 21–23 and 0–4
  }

  return { init, _tick, _formatTime, _formatDate, _getGreeting };
})();

// ---------------------------------------------------------------------------
// FocusTimer — 25-minute (1500-second) Pomodoro countdown state machine
// ---------------------------------------------------------------------------
const FocusTimer = (() => {
  /** @type {{remaining: number, status: 'IDLE'|'RUNNING'|'PAUSED'|'DONE', intervalId: number|null}} */
  const _state = {
    remaining: 1500,
    status: 'IDLE',
    intervalId: null,
  };

  // Private DOM references (set in init)
  let _elDisplay = null;
  let _elStart = null;
  let _elStop = null;
  let _elReset = null;
  let _elComplete = null;

  /**
   * Bind DOM elements and wire up button click handlers.
   * Implements: Requirements 3.1–3.9
   */
  function init() {
    _elDisplay = document.getElementById('timer-display');
    _elStart = document.getElementById('timer-start');
    _elStop = document.getElementById('timer-stop');
    _elReset = document.getElementById('timer-reset');
    _elComplete = document.getElementById('timer-complete');
    if (_elStart) _elStart.addEventListener('click', _start);
    if (_elStop) _elStop.addEventListener('click', _stop);
    if (_elReset) _elReset.addEventListener('click', _reset);
    _render();
  }

  /** Transition IDLE/PAUSED → RUNNING; start 1-second interval. */
  function _start() {
    if (_state.status !== 'IDLE' && _state.status !== 'PAUSED') return;
    _state.status = 'RUNNING';
    _state.intervalId = setInterval(_tick, 1000);
    _render();
  }

  /** Transition RUNNING → PAUSED; clear interval. */
  function _stop() {
    if (_state.status !== 'RUNNING') return;
    clearInterval(_state.intervalId);
    _state.intervalId = null;
    _state.status = 'PAUSED';
    _render();
  }

  /** Transition any state → IDLE; restore remaining to 1500; clear interval. */
  function _reset() {
    if (_state.intervalId !== null) {
      clearInterval(_state.intervalId);
      _state.intervalId = null;
    }
    _state.remaining = 1500;
    _state.status = 'IDLE';
    _render();
  }

  /** Decrement remaining by 1; detect 00:00 and transition to DONE. */
  function _tick() {
    if (_state.status !== 'RUNNING') return;
    _state.remaining -= 1;
    if (_state.remaining <= 0) {
      _state.remaining = 0;
      clearInterval(_state.intervalId);
      _state.intervalId = null;
      _state.status = 'DONE';
    }
    _render();
  }

  /** Update #timer-display, button enabled states, and completion indicator. */
  function _render() {
    if (_elDisplay) {
      _elDisplay.textContent = _formatTime(_state.remaining);
    }

    // Button enabled/disabled states per status
    // IDLE:    Start=enabled,  Stop=disabled
    // RUNNING: Start=disabled, Stop=enabled
    // PAUSED:  Start=enabled,  Stop=disabled
    // DONE:    Start=disabled, Stop=disabled
    if (_elStart) {
      _elStart.disabled = _state.status === 'RUNNING' || _state.status === 'DONE';
    }
    if (_elStop) {
      _elStop.disabled = _state.status !== 'RUNNING';
    }

    // Show completion indicator only in DONE state
    if (_elComplete) {
      _elComplete.hidden = _state.status !== 'DONE';
    }

    // Apply CSS state classes to the widget for color-coded display
    const widget = document.getElementById('widget-timer');
    if (widget) {
      widget.classList.toggle('timer-running', _state.status === 'RUNNING');
      widget.classList.toggle('timer-paused',  _state.status === 'PAUSED');
      widget.classList.toggle('timer-done',    _state.status === 'DONE');
    }
  }

  /**
   * Convert seconds to "MM:SS" format string.
   * e.g. 1500 → "25:00", 65 → "01:05", 0 → "00:00"
   * @param {number} secs
   * @returns {string}
   */
  function _formatTime(secs) {
    const totalSeconds = Math.max(0, Math.floor(secs));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  return { init, _start, _stop, _reset, _tick, _render, _formatTime };
})();

// ---------------------------------------------------------------------------
// TodoList — full CRUD for tasks with localStorage persistence
// ---------------------------------------------------------------------------
const TodoList = (() => {
  /** @type {Array<{id: string, text: string, completed: boolean}>} */
  let _tasks = [];

  // Private DOM references (set in init)
  let _elInput = null;
  let _elAdd = null;
  let _elList = null;

  /**
   * Load persisted tasks and render the initial list.
   * Implements: Requirements 4.1–4.5, 5.1–5.6, 6.1–6.6, 7.1–7.3
   */
  function init() {
    _elInput = document.getElementById('todo-input');
    _elAdd = document.getElementById('todo-add');
    _elList = document.getElementById('todo-list');
    _tasks = _load();
    _renderList();
    if (_elAdd) _elAdd.addEventListener('click', () => _addTask(_elInput.value));
    if (_elInput) _elInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') _addTask(_elInput.value);
    });
  }

  /**
   * Validate, create, and append a new task.
   * @param {string} text
   */
  function _addTask(text) {
    const trimmedText = text.trim();
    if (!trimmedText) {
      if (_elInput) _elInput.focus();
      return;
    }
    const id = Date.now().toString() + Math.random();
    const task = { id, text: trimmedText, completed: false };
    _tasks.push(task);
    _save();
    _renderList();
    if (_elInput) _elInput.value = '';
  }

  /**
   * Validate and update an existing task's text.
   * Editing is handled via _enterEditMode / _exitEditMode; this stub is kept
   * for API completeness but is not called directly.
   * @param {string} id
   * @param {string} newText
   */
  function _editTask(id, newText) {
    // Intentional stub — editing is handled through _enterEditMode / _exitEditMode
  }

  /**
   * Remove a task by id, persist, and re-render.
   * Implements: Requirements 6.4, 6.5, 6.6
   * @param {string} id
   */
  function _deleteTask(id) {
    _tasks = _tasks.filter((t) => t.id !== id);
    _save();
    _renderList();
  }

  /**
   * Flip the completed flag for a task, persist, and update the visual state.
   * Implements: Requirements 6.1, 6.2, 6.3, 6.6
   * @param {string} id
   */
  function _toggleComplete(id) {
    const task = _tasks.find((t) => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    _save();
    _renderList();
  }

  /** Serialize _tasks to localStorage under key "todo_tasks". */
  function _save() {
    try {
      localStorage.setItem('todo_tasks', JSON.stringify(_tasks));
    } catch (err) {
      console.error('TodoList: failed to save tasks to localStorage', err);
    }
  }

  /**
   * Deserialize _tasks from localStorage.
   * @returns {Array<{id: string, text: string, completed: boolean}>}
   */
  function _load() {
    try {
      const raw = localStorage.getItem('todo_tasks');
      if (raw === null) return [];
      return JSON.parse(raw);
    } catch (err) {
      console.warn('TodoList: failed to load tasks from localStorage, starting fresh', err);
      return [];
    }
  }

  /** Clear and re-render the full task list. */
  function _renderList() {
    if (!_elList) return;
    _elList.innerHTML = '';
    _tasks.forEach((task) => {
      const li = _renderTask(task);
      if (li) _elList.appendChild(li);
    });
  }

  /**
   * Create and return the HTMLElement for a single task row.
   * @param {{id: string, text: string, completed: boolean}} task
   * @returns {HTMLElement}
   */
  function _renderTask(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-complete';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => _toggleComplete(task.id));

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = task.text;

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'todo-edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => _enterEditMode(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'todo-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => _deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
  }

  /**
   * Replace the text span with an inline edit input for the given task id.
   * @param {string} id
   */
  function _enterEditMode(id) {
    if (!_elList) return;
    const li = _elList.querySelector(`[data-id="${id}"]`);
    if (!li) return;

    const span = li.querySelector('.todo-text');
    if (!span) return;

    // Create the inline edit input pre-populated with current text
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'todo-edit-input';
    input.value = span.textContent;

    // Create Save and Cancel buttons
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'todo-save';
    saveBtn.textContent = 'Save';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'todo-cancel';
    cancelBtn.textContent = 'Cancel';

    // Keyboard bindings on the input
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') _exitEditMode(id, true);
      if (event.key === 'Escape') _exitEditMode(id, false);
    });

    // Button click bindings
    saveBtn.addEventListener('click', () => _exitEditMode(id, true));
    cancelBtn.addEventListener('click', () => _exitEditMode(id, false));

    // Remove the Edit button from the li
    const editBtn = li.querySelector('.todo-edit');
    if (editBtn) li.removeChild(editBtn);

    // Replace the display span with the input, then append Save/Cancel
    li.replaceChild(input, span);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);

    // Add .editing class for browsers that do not support :has()
    li.classList.add('editing');

    input.focus();
  }

  /**
   * Exit edit mode; optionally save the new text.
   * @param {string} id
   * @param {boolean} save
   */
  function _exitEditMode(id, save) {
    if (save) {
      if (!_elList) { _renderList(); return; }
      const li = _elList.querySelector(`[data-id="${id}"]`);
      const input = li ? li.querySelector('.todo-edit-input') : null;
      const trimmedValue = input ? input.value.trim() : '';

      if (!trimmedValue) {
        // Empty value — reject update, restore display mode
        _renderList();
        return;
      }

      // Update the task text, persist, and re-render
      const task = _tasks.find((t) => t.id === id);
      if (task) {
        task.text = trimmedValue;
        _save();
      }
      _renderList();
    } else {
      // Cancel — discard changes and restore display mode
      _renderList();
    }
  }

  return {
    init,
    _addTask,
    _editTask,
    _deleteTask,
    _toggleComplete,
    _save,
    _load,
    _renderList,
    _renderTask,
    _enterEditMode,
    _exitEditMode,
  };
})();

// ---------------------------------------------------------------------------
// QuickLinks — named-URL bookmark management with localStorage persistence
// ---------------------------------------------------------------------------
const QuickLinks = (() => {
  /** @type {Array<{id: string, name: string, url: string}>} */
  let _links = [];

  // Private DOM references (set in init)
  let _elName = null;
  let _elUrl = null;
  let _elAdd = null;
  let _elError = null;
  let _elList = null;

  /**
   * Load persisted links and render the initial list.
   * Implements: Requirements 8.1–8.6, 9.1–9.4
   */
  function init() {
    _elName = document.getElementById('links-name');
    _elUrl = document.getElementById('links-url');
    _elAdd = document.getElementById('links-add');
    _elError = document.getElementById('links-error');
    _elList = document.getElementById('links-list');
    _links = _load();
    _renderList();
    if (_elAdd) _elAdd.addEventListener('click', () => _addLink(_elName.value, _elUrl.value));
  }

  /**
   * Validate, create, and append a new link.
   * @param {string} name
   * @param {string} url
   */
  function _addLink(name, url) {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName) {
      _showError('Please enter a link name.');
      return;
    }
    if (!trimmedUrl) {
      _showError('Please enter a URL.');
      return;
    }

    const id = Date.now().toString() + Math.random();
    const link = { id, name: trimmedName, url: trimmedUrl };
    _links.push(link);
    _save();
    _renderList();
    _clearError();
    if (_elName) _elName.value = '';
    if (_elUrl) _elUrl.value = '';
  }

  /**
   * Remove a link by id, persist, and re-render.
   * @param {string} id
   */
  function _deleteLink(id) {
    _links = _links.filter((l) => l.id !== id);
    _save();
    _renderList();
  }

  /** Serialize _links to localStorage under key "quick_links". */
  function _save() {
    try {
      localStorage.setItem('quick_links', JSON.stringify(_links));
    } catch (err) {
      console.error('QuickLinks: failed to save links to localStorage', err);
    }
  }

  /**
   * Deserialize _links from localStorage.
   * @returns {Array<{id: string, name: string, url: string}>}
   */
  function _load() {
    try {
      const raw = localStorage.getItem('quick_links');
      if (raw === null) return [];
      return JSON.parse(raw);
    } catch (err) {
      console.warn('QuickLinks: failed to load links from localStorage, starting fresh', err);
      return [];
    }
  }

  /** Clear and re-render the full links list. */
  function _renderList() {
    if (!_elList) return;
    _elList.innerHTML = '';
    _links.forEach((link) => {
      const item = _renderLink(link);
      if (item) _elList.appendChild(item);
    });
  }

  /**
   * Create and return the HTMLElement for a single link entry.
   * @param {{id: string, name: string, url: string}} link
   * @returns {HTMLElement}
   */
  function _renderLink(link) {
    const div = document.createElement('div');
    div.className = 'link-item';

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'link-open';
    openBtn.dataset.url = link.url;
    openBtn.textContent = link.name;
    openBtn.addEventListener('click', () => window.open(link.url, '_blank', 'noopener,noreferrer'));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'link-delete';
    deleteBtn.dataset.id = link.id;
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => _deleteLink(link.id));

    div.appendChild(openBtn);
    div.appendChild(deleteBtn);

    return div;
  }

  /**
   * Display an inline validation error in #links-error.
   * @param {string} msg
   */
  function _showError(msg) {
    if (_elError) _elError.textContent = msg;
  }

  /** Hide / clear the #links-error element. */
  function _clearError() {
    if (_elError) _elError.textContent = '';
  }

  return {
    init,
    _addLink,
    _deleteLink,
    _save,
    _load,
    _renderList,
    _renderLink,
    _showError,
    _clearError,
  };
})();

// ---------------------------------------------------------------------------
// App — top-level coordinator
// Bootstraps all widgets after the DOM is ready.
// ---------------------------------------------------------------------------
const App = {
  init() {
    GreetingWidget.init();
    FocusTimer.init();
    TodoList.init();
    QuickLinks.init();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
