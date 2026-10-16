# Requirements Document

## Introduction

The Todo List Life Dashboard is a single-page web application built with pure HTML, CSS, and vanilla JavaScript. It runs entirely in the browser with no backend or external frameworks. All data is persisted via the browser's Local Storage API. The dashboard combines four functional widgets — a Greeting Widget, a Focus Timer, a To-Do List, and a Quick Links manager — presented in a clean, minimal, responsive layout that works across Chrome, Firefox, Edge, and Safari.

## Glossary

- **Dashboard**: The single-page web application that hosts all four widgets.
- **Greeting_Widget**: The widget that displays the current time, date, and a time-of-day greeting message.
- **Focus_Timer**: The countdown timer widget pre-set to 25 minutes.
- **Todo_List**: The widget that manages the user's tasks (add, edit, complete, delete).
- **Task**: A single to-do item consisting of a text description and a completion state.
- **Quick_Links**: The widget that stores and displays user-defined named hyperlinks.
- **Link**: A Quick Links entry consisting of a user-provided name and a URL.
- **Local_Storage**: The browser's `localStorage` API used for all client-side data persistence.
- **Viewport**: The visible area of the browser window.

---

## Requirements

### Requirement 1: Greeting Widget — Time and Date Display

**User Story:** As a user, I want to see the current time and date at a glance, so that I can stay oriented throughout my day without checking another app.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM:SS format (24-hour or 12-hour with AM/PM indicator).
2. THE Greeting_Widget SHALL display the current date including the full weekday name, day number, month name, and four-digit year (e.g., "Monday, 14 July 2025").
3. WHEN the Greeting_Widget is rendered, THE Greeting_Widget SHALL update the displayed time every 1 second.

---

### Requirement 2: Greeting Widget — Time-of-Day Greeting

**User Story:** As a user, I want to receive a personalized greeting based on the time of day, so that the dashboard feels relevant and welcoming each session.

#### Acceptance Criteria

1. WHEN the current hour is between 05:00 and 11:59 (inclusive), THE Greeting_Widget SHALL display the greeting "Good Morning".
2. WHEN the current hour is between 12:00 and 16:59 (inclusive), THE Greeting_Widget SHALL display the greeting "Good Afternoon".
3. WHEN the current hour is between 17:00 and 20:59 (inclusive), THE Greeting_Widget SHALL display the greeting "Good Evening".
4. WHEN the current hour is between 21:00 and 04:59 (inclusive, spanning midnight), THE Greeting_Widget SHALL display the greeting "Good Night".
5. WHEN the current time transitions from one time-of-day range to another, THE Greeting_Widget SHALL update the displayed greeting within 1 second.

---

### Requirement 3: Focus Timer — Countdown Behaviour

**User Story:** As a user, I want a 25-minute focus timer, so that I can time work sessions using the Pomodoro technique without leaving the dashboard.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialise with a countdown value of 25 minutes and 00 seconds (25:00) every time the Dashboard is loaded.
2. THE Focus_Timer SHALL display the remaining time in MM:SS format at all times.
3. WHEN the user activates the Start control, THE Focus_Timer SHALL begin decrementing the displayed time by 1 second at 1-second intervals.
4. WHEN the user activates the Stop control, THE Focus_Timer SHALL pause the countdown and retain the current remaining time.
5. WHEN the user activates the Reset control, THE Focus_Timer SHALL stop the countdown and restore the displayed time to 25:00.
6. WHEN the remaining time reaches 00:00, THE Focus_Timer SHALL stop the countdown automatically.
7. WHEN the remaining time reaches 00:00, THE Focus_Timer SHALL display a visible completion indicator to notify the user the session has ended.
8. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL keep the Start control in a disabled state.
9. WHILE the Focus_Timer is paused or reset, THE Focus_Timer SHALL keep the Stop control in a disabled state.

---

### Requirement 4: To-Do List — Task Creation

**User Story:** As a user, I want to add new tasks to my to-do list, so that I can track what I need to accomplish.

#### Acceptance Criteria

1. THE Todo_List SHALL provide a text input field and an Add control for creating new tasks.
2. WHEN the user submits a non-empty task description via the Add control or by pressing the Enter key, THE Todo_List SHALL append the new Task to the task list with an incomplete state.
3. IF the user attempts to submit an empty or whitespace-only task description, THEN THE Todo_List SHALL reject the submission and retain focus on the input field.
4. WHEN a new Task is added, THE Todo_List SHALL persist all tasks to Local_Storage immediately.
5. WHEN a new Task is added, THE Todo_List SHALL clear the text input field.

---

### Requirement 5: To-Do List — Task Editing

**User Story:** As a user, I want to edit existing tasks, so that I can correct or update task descriptions without deleting and re-adding them.

#### Acceptance Criteria

1. THE Todo_List SHALL provide an Edit control for each Task in the list.
2. WHEN the user activates the Edit control for a Task, THE Todo_List SHALL replace the Task's display text with an editable text field pre-populated with the current task description.
3. WHEN the user confirms the edited text via a Save control or by pressing the Enter key, THE Todo_List SHALL update the Task description with the new text and return to display mode.
4. IF the user confirms an edit with an empty or whitespace-only text field, THEN THE Todo_List SHALL reject the update and retain the original task description.
5. WHEN the user cancels an edit via a Cancel control or by pressing the Escape key, THE Todo_List SHALL discard the changes and return the Task to display mode with the original text.
6. WHEN a Task description is successfully updated, THE Todo_List SHALL persist the change to Local_Storage immediately.

---

### Requirement 6: To-Do List — Task Completion and Deletion

**User Story:** As a user, I want to mark tasks as done and remove tasks I no longer need, so that I can maintain an accurate and tidy task list.

#### Acceptance Criteria

1. THE Todo_List SHALL provide a completion toggle control (e.g., checkbox) for each Task.
2. WHEN the user activates the completion toggle for an incomplete Task, THE Todo_List SHALL mark the Task as complete and apply a visual distinction (e.g., strikethrough text).
3. WHEN the user activates the completion toggle for a complete Task, THE Todo_List SHALL mark the Task as incomplete and remove the visual distinction.
4. THE Todo_List SHALL provide a Delete control for each Task.
5. WHEN the user activates the Delete control for a Task, THE Todo_List SHALL remove the Task from the list permanently.
6. WHEN a Task's completion state changes or a Task is deleted, THE Todo_List SHALL persist the updated task list to Local_Storage immediately.

---

### Requirement 7: To-Do List — Persistence and Restoration

**User Story:** As a user, I want my tasks to be saved between browser sessions, so that I don't lose my task list when I close or refresh the page.

#### Acceptance Criteria

1. WHEN the Dashboard is loaded, THE Todo_List SHALL read all persisted tasks from Local_Storage and render them in the same order they were saved.
2. WHEN Local_Storage contains no saved tasks, THE Todo_List SHALL render an empty task list with no errors.
3. THE Todo_List SHALL store all tasks as a JSON array under a single, consistent Local_Storage key.

---

### Requirement 8: Quick Links — Link Management

**User Story:** As a user, I want to save and manage favourite website links, so that I can access frequently used sites directly from the dashboard.

#### Acceptance Criteria

1. THE Quick_Links widget SHALL provide a name input field, a URL input field, and an Add Link control.
2. WHEN the user submits a non-empty name and a non-empty URL via the Add Link control, THE Quick_Links widget SHALL add the new Link to the link list.
3. IF the user attempts to submit with an empty name field or an empty URL field, THEN THE Quick_Links widget SHALL reject the submission and display a visible error message indicating which field is missing.
4. WHEN a Link is added, THE Quick_Links widget SHALL persist all links to Local_Storage immediately.
5. THE Quick_Links widget SHALL provide a Delete control for each Link.
6. WHEN the user activates the Delete control for a Link, THE Quick_Links widget SHALL remove the Link from the list permanently and persist the updated list to Local_Storage immediately.

---

### Requirement 9: Quick Links — Link Display and Navigation

**User Story:** As a user, I want my saved links displayed as clickable buttons, so that I can navigate to my favourite sites with a single click.

#### Acceptance Criteria

1. THE Quick_Links widget SHALL render each saved Link as a clickable button labelled with the Link's user-provided name.
2. WHEN the user activates a Link button, THE Quick_Links widget SHALL open the associated URL in a new browser tab.
3. WHEN the Dashboard is loaded, THE Quick_Links widget SHALL read all persisted links from Local_Storage and render them.
4. WHEN Local_Storage contains no saved links, THE Quick_Links widget SHALL render an empty link list with no errors.

---

### Requirement 10: Layout and Responsiveness

**User Story:** As a user, I want the dashboard to be readable and usable on different screen sizes, so that I can use it on both desktop and mobile browsers.

#### Acceptance Criteria

1. THE Dashboard SHALL arrange all four widgets in a single-page layout with no scrolling required on Viewports wider than 1024px.
2. WHEN the Viewport width is below 768px, THE Dashboard SHALL reflow the widget layout to a single-column arrangement.
3. THE Dashboard SHALL use a single external CSS file located at `css/` relative to the HTML entry point.
4. THE Dashboard SHALL use a single external JavaScript file located at `js/` relative to the HTML entry point.
5. THE Dashboard SHALL load and render all widgets within 2 seconds on a standard broadband connection with no external network requests.
6. THE Dashboard SHALL render without errors in the current stable releases of Chrome, Firefox, Edge, and Safari.
