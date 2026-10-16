/**
 * TodoList — data layer and localStorage integration tests
 * Covers: Requirements 7.1, 7.2, 7.3
 *
 * Feature: todo-list-life-dashboard
 * Property 4: Task persistence round-trip
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';

// ---------------------------------------------------------------------------
// Inline implementation under test
// (Extracted from app.js to run in Node — mirrors the IIFE module exactly)
// ---------------------------------------------------------------------------

function makeTodoListDataLayer() {
  let _tasks = [];

  const STORAGE_KEY = 'todo_tasks';

  // Minimal localStorage shim (overridden in tests via vi.stubGlobal)
  function _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_tasks));
    } catch (err) {
      console.error('TodoList: failed to save tasks to localStorage', err);
    }
  }

  function _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return [];
      return JSON.parse(raw);
    } catch (err) {
      console.warn('TodoList: failed to load tasks from localStorage, starting fresh', err);
      return [];
    }
  }

  function init() {
    _tasks = _load();
  }

  function getTasks() {
    return _tasks;
  }

  function setTasks(tasks) {
    _tasks = tasks;
  }

  return { init, _save, _load, getTasks, setTasks };
}

// ---------------------------------------------------------------------------
// Arbitrary generators
// ---------------------------------------------------------------------------

const taskArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  text: fc.string({ minLength: 1, maxLength: 100 }),
  completed: fc.boolean(),
});

const taskArrayArb = fc.array(taskArb, { minLength: 0, maxLength: 20 });

// ---------------------------------------------------------------------------
// localStorage mock factory
// ---------------------------------------------------------------------------

function makeLocalStorageMock() {
  let store = {};
  return {
    getItem: vi.fn((key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null)),
    setItem: vi.fn((key, value) => { store[key] = String(value); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get _store() { return store; },
  };
}

// ---------------------------------------------------------------------------
// Unit tests — Requirement 7.1, 7.2, 7.3
// ---------------------------------------------------------------------------

describe('TodoList data layer — _save() and _load()', () => {
  let localStorageMock;
  let dataLayer;

  beforeEach(() => {
    localStorageMock = makeLocalStorageMock();
    vi.stubGlobal('localStorage', localStorageMock);
    dataLayer = makeTodoListDataLayer();
  });

  // --- Requirement 7.2: empty state ---

  it('_load() returns [] when localStorage has no saved tasks (null)', () => {
    // getItem returns null by default (empty store)
    const result = dataLayer._load();
    expect(result).toEqual([]);
  });

  it('init() initializes tasks to [] when no data is stored', () => {
    dataLayer.init();
    expect(dataLayer.getTasks()).toEqual([]);
  });

  // --- Requirement 7.3: consistent storage key ---

  it('_save() writes to localStorage under the key "todo_tasks"', () => {
    const tasks = [{ id: '1', text: 'Buy milk', completed: false }];
    dataLayer.setTasks(tasks);
    dataLayer._save();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('todo_tasks', JSON.stringify(tasks));
  });

  it('_load() reads from localStorage under the key "todo_tasks"', () => {
    dataLayer._load();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('todo_tasks');
  });

  // --- Requirement 7.1: persisted tasks are restored on load ---

  it('_load() returns tasks previously saved by _save()', () => {
    const tasks = [
      { id: '1', text: 'Buy milk', completed: false },
      { id: '2', text: 'Read chapter 3', completed: true },
    ];
    dataLayer.setTasks(tasks);
    dataLayer._save();

    // Simulate fresh load by reading back
    const loaded = dataLayer._load();
    expect(loaded).toEqual(tasks);
  });

  it('init() restores tasks from localStorage in the same order', () => {
    const tasks = [
      { id: 'a', text: 'First task', completed: false },
      { id: 'b', text: 'Second task', completed: true },
      { id: 'c', text: 'Third task', completed: false },
    ];
    // Seed localStorage with pre-serialized tasks
    localStorageMock.setItem('todo_tasks', JSON.stringify(tasks));

    dataLayer.init();
    expect(dataLayer.getTasks()).toEqual(tasks);
  });

  // --- Error handling ---

  it('_load() returns [] and does not throw when localStorage contains malformed JSON', () => {
    localStorageMock.setItem('todo_tasks', '{invalid json[[[');
    expect(() => dataLayer._load()).not.toThrow();
    expect(dataLayer._load()).toEqual([]);
  });

  it('_save() does not throw when localStorage.setItem throws (e.g. quota exceeded)', () => {
    localStorageMock.setItem.mockImplementation(() => { throw new Error('QuotaExceededError'); });
    dataLayer.setTasks([{ id: '1', text: 'Task', completed: false }]);
    expect(() => dataLayer._save()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Property 4: Task persistence round-trip
// Feature: todo-list-life-dashboard, Property 4: Task persistence round-trip
// Validates: Requirements 4.4, 7.1, 7.3
// ---------------------------------------------------------------------------

describe('Property 4: Task persistence round-trip', () => {
  it(
    'serializing via _save() then deserializing via _load() produces a deep-equal array',
    () => {
      // Feature: todo-list-life-dashboard, Property 4: Task persistence round-trip
      fc.assert(
        fc.property(taskArrayArb, (tasks) => {
          // Fresh mock for each run to avoid cross-contamination
          const lsMock = makeLocalStorageMock();
          vi.stubGlobal('localStorage', lsMock);

          const dl = makeTodoListDataLayer();
          dl.setTasks(tasks);
          dl._save();

          const loaded = dl._load();
          expect(loaded).toEqual(tasks);
        }),
        { numRuns: 100 }
      );
    }
  );
});
