# Implementation Plan: Todo List Life Dashboard

## Overview

This plan breaks down the implementation of the Todo List Life Dashboard into discrete coding tasks. The dashboard is built with pure HTML5, CSS3, and vanilla JavaScript (ES6+) with no external frameworks or build tools. Each task builds incrementally toward a complete single-page application with four independent widgets: Greeting Widget, Focus Timer, Todo List, and Quick Links.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create `index.html` with semantic HTML5 structure
  - Add container elements for all four widgets with proper IDs
  - Include DOM elements for Greeting Widget: `#greeting-text`, `#time-display`, `#date-display`
  - Include DOM elements for Focus Timer: `#timer-display`, `#timer-start`, `#timer-stop`, `#timer-reset`, `#timer-complete`
  - Include DOM elements for Todo List: `#todo-input`, `#todo-add`, `#todo-list` (ul container)
  - Include DOM elements for Quick Links: `#links-name`, `#links-url`, `#links-add`, `#links-error`, `#links-list`
  - Link external CSS file at `css/style.css`
  - Link external JavaScript file at `js/app.js` with `defer` attribute
  - _Requirements: 10.3, 10.4_

- [x] 2. Implement base CSS layout and responsive grid
  - Create `css/style.css` with CSS reset and base typography
  - Implement CSS Grid two-column layout for desktop (≥1024px viewport)
  - Add media query for single-column mobile layout (<768px viewport)
  - Style widget containers with consistent spacing and visual hierarchy
  - Ensure all four widgets fit on screen without scrolling on desktop
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 3. Create JavaScript module structure and App coordinator
  - Create `js/app.js` with IIFE-based module pattern
  - Implement `App` coordinator object with `init()` method
  - Add `DOMContentLoaded` event listener to bootstrap all widgets
  - Create empty module shells for `GreetingWidget`, `FocusTimer`, `TodoList`, `QuickLinks`
  - Each module should have an `init()` method called by `App.init()`
  - _Requirements: 10.4_

- [x] 4. Implement Greeting Widget time and date display
  - [x] 4.1 Build Greeting Widget core functionality
    - Implement `GreetingWidget.init()` to bind DOM elements and start 1-second interval
    - Implement `_tick()` method to update time, date, and greeting every second
    - Implement `_formatTime(date)` to return HH:MM:SS format with AM/PM indicator
    - Implement `_formatDate(date)` to return "Weekday, DD Month YYYY" format
    - Update `#time-display` and `#date-display` elements in real-time
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.2 Implement time-of-day greeting logic
    - Implement `_getGreeting(hour)` with four time ranges and greeting phrases
    - Return "Good Morning" for hours 05-11
    - Return "Good Afternoon" for hours 12-16
    - Return "Good Evening" for hours 17-20
    - Return "Good Night" for hours 21-04 (wrapping midnight)
    - Update `#greeting-text` element with current greeting
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 5. Implement Focus Timer state machine and controls
  - [x] 5.1 Build Focus Timer core state machine
    - Implement timer state object with `remaining` (1500 seconds initially), `status` (IDLE/RUNNING/PAUSED/DONE), and `intervalId`
    - Implement `_start()` method: transition IDLE/PAUSED → RUNNING, create 1-second interval
    - Implement `_stop()` method: transition RUNNING → PAUSED, clear interval
    - Implement `_reset()` method: transition any state → IDLE, restore remaining to 1500
    - Implement `_tick()` method: decrement remaining by 1, detect 00:00 and transition to DONE
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6_

  - [x] 5.2 Implement Focus Timer UI rendering and controls
    - Implement `_formatTime(secs)` to return MM:SS format string
    - Implement `_render()` method to update `#timer-display` with formatted time
    - Update button states: disable Start when RUNNING, disable Stop when IDLE/PAUSED/DONE
    - Show/hide `#timer-complete` completion indicator in DONE state only
    - Bind click handlers to `#timer-start`, `#timer-stop`, `#timer-reset` buttons
    - _Requirements: 3.2, 3.7, 3.8, 3.9_

- [x] 6. Implement Todo List CRUD operations and persistence
  - [x] 6.1 Build Todo List data layer and localStorage integration
    - Implement `_save()` method: serialize tasks array to localStorage key "todo_tasks"
    - Implement `_load()` method: parse JSON from localStorage, return empty array if null
    - Wrap localStorage operations in try/catch with fallback to empty array on errors
    - Initialize tasks array in `init()` by calling `_load()`
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 6.2 Implement task creation functionality
    - Bind event handlers to `#todo-add` button and Enter key on `#todo-input`
    - Implement `_addTask(text)` method with whitespace validation
    - Reject empty or whitespace-only submissions, keep focus on input
    - Generate unique task ID using `Date.now().toString() + Math.random()`
    - Create Task object `{id, text, completed: false}` and append to tasks array
    - Call `_save()` and `_renderList()` after successful addition
    - Clear `#todo-input` field after adding task
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 6.3 Implement task rendering and display
    - Implement `_renderList()` method: clear `#todo-list` ul, render all tasks
    - Implement `_renderTask(task)` method: create `<li>` with checkbox, text span, Edit button, Delete button
    - Add `data-id` attribute to each `<li>` element
    - Apply strikethrough style to completed tasks via CSS class
    - Bind click handlers for checkbox (toggle complete), Edit button, Delete button
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 6.4 Implement task editing functionality
    - Implement `_enterEditMode(id)` method: replace text span with input field and Save/Cancel buttons
    - Pre-populate edit input with current task text
    - Bind Enter key to save, Escape key to cancel
    - Implement `_exitEditMode(id, save)` method: validate new text if saving
    - Reject empty/whitespace-only edits, restore original text
    - Update task text in tasks array, call `_save()` and re-render on successful save
    - Restore display mode on cancel without changes
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 6.5 Implement task completion toggle and deletion
    - Implement `_toggleComplete(id)` method: flip task.completed boolean
    - Update task visual style (add/remove strikethrough CSS class)
    - Call `_save()` immediately after toggle
    - Implement `_deleteTask(id)` method: filter out task by id from tasks array
    - Call `_save()` and `_renderList()` after deletion
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 7. Implement Quick Links CRUD operations and persistence
  - [x] 7.1 Build Quick Links data layer and localStorage integration
    - Implement `_save()` method: serialize links array to localStorage key "quick_links"
    - Implement `_load()` method: parse JSON from localStorage, return empty array if null
    - Wrap localStorage operations in try/catch with fallback to empty array on errors
    - Initialize links array in `init()` by calling `_load()`
    - _Requirements: 9.3, 9.4_

  - [x] 7.2 Implement link creation with validation
    - Bind click handler to `#links-add` button
    - Implement `_addLink(name, url)` method with empty-field validation
    - Reject submission if either name or url is empty/whitespace-only
    - Implement `_showError(msg)` and `_clearError()` methods for `#links-error` element
    - Display specific error message indicating which field is missing
    - Generate unique link ID using `Date.now().toString() + Math.random()`
    - Create Link object `{id, name, url}` and append to links array
    - Call `_save()`, `_renderList()`, and `_clearError()` after successful addition
    - Clear `#links-name` and `#links-url` input fields
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 7.3 Implement link rendering and navigation
    - Implement `_renderList()` method: clear `#links-list` container, render all links
    - Implement `_renderLink(link)` method: create button labeled with link.name
    - Set button `data-url` attribute to link.url
    - Bind click handler to open URL in new tab using `window.open(url, '_blank')`
    - Add Delete button for each link with `data-id` attribute
    - _Requirements: 9.1, 9.2_

  - [x] 7.4 Implement link deletion
    - Implement `_deleteLink(id)` method: filter out link by id from links array
    - Call `_save()` and `_renderList()` after deletion
    - Bind click handlers to all Delete buttons
    - _Requirements: 8.5, 8.6_

- [x] 8. Add widget-specific styling and visual polish
  - Style Greeting Widget with large, readable time display and elegant date format
  - Style Focus Timer with prominent countdown display and color-coded states
  - Style completion indicator to be clearly visible in DONE state
  - Style Todo List with clear separation between tasks, visible checkboxes, and action buttons
  - Style task edit mode with inline input field and Save/Cancel buttons
  - Style Quick Links with button-like appearance for each link and hover states
  - Style error messages in Quick Links widget with appropriate color and spacing
  - Ensure consistent spacing, colors, and typography across all widgets
  - Test visual appearance in Chrome, Firefox, Edge, and Safari
  - _Requirements: 10.6_

- [x] 9. Cross-browser testing and final integration
  - Test complete application in Chrome stable (time display, timer, tasks, links)
  - Test complete application in Firefox stable (localStorage persistence, date formatting)
  - Test complete application in Edge stable (button interactions, state transitions)
  - Test complete application in Safari stable (CSS Grid layout, event handlers)
  - Verify all four widgets render correctly on desktop (≥1024px viewport)
  - Verify single-column layout on mobile (<768px viewport) using browser dev tools
  - Test localStorage persistence: add tasks/links, refresh page, verify data restored
  - Verify page loads and renders all widgets within 2 seconds
  - _Requirements: 10.5, 10.6, 10.1, 10.2_

- [x] 10. Checkpoint - Final validation
  - Verify all requirements are met by testing each acceptance criterion
  - Ensure no console errors appear in any supported browser
  - Confirm all data persists correctly between page refreshes
  - Validate that no external network requests are made after initial page load
  - Ensure application works by simply opening index.html in browser (no build step required)

## Notes

- This feature uses **no external frameworks or libraries** — pure vanilla JavaScript only
- There is **no test setup or testing framework** included in this implementation
- All four widgets are independent modules with their own initialization and state management
- LocalStorage operations are wrapped in try/catch for graceful degradation
- Each widget calls `_save()` immediately after any data mutation to ensure persistence
- The Focus Timer state machine ensures correct button enable/disable states
- Task and link IDs use `Date.now() + Math.random()` for uniqueness without external libraries
- CSS Grid provides responsive layout with a single media query at 768px breakpoint
- The design document includes 12 correctness properties, but no property-based testing is implemented per user specification
- All tasks build incrementally — early tasks establish structure, later tasks add functionality
- Final checkpoint validates cross-browser compatibility and requirement coverage

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2", "3"] },
    { "id": 2, "tasks": ["4.1", "4.2"] },
    { "id": 3, "tasks": ["5.1", "5.2"] },
    { "id": 4, "tasks": ["6.1"] },
    { "id": 5, "tasks": ["6.2", "7.1"] },
    { "id": 6, "tasks": ["6.3", "7.2"] },
    { "id": 7, "tasks": ["6.4", "7.3"] },
    { "id": 8, "tasks": ["6.5", "7.4"] },
    { "id": 9, "tasks": ["8"] },
    { "id": 10, "tasks": ["9"] },
    { "id": 11, "tasks": ["10"] }
  ]
}
```
