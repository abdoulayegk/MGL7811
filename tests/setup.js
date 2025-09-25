/**
 * Test Setup for Jest
 * Part of MGL7811 Personal Project by Abdoulaye GK
 */

// Mock localStorage for testing
class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }

    removeItem(key) {
        delete this.store[key];
    }

    get length() {
        return Object.keys(this.store).length;
    }

    key(index) {
        const keys = Object.keys(this.store);
        return keys[index] || null;
    }
}

// Set up global mocks
global.localStorage = new LocalStorageMock();

// Mock console methods to reduce noise in tests
global.console.warn = jest.fn();
global.console.error = jest.fn();

// Set up date mocking utilities
global.mockDate = (dateString) => {
    const RealDate = Date;
    global.Date = class extends RealDate {
        constructor(...args) {
            if (args.length === 0) {
                return new RealDate(dateString);
            }
            return new RealDate(...args);
        }
        
        static now() {
            return new RealDate(dateString).getTime();
        }
    };
    global.Date.UTC = RealDate.UTC;
    global.Date.parse = RealDate.parse;
};

global.restoreDate = () => {
    global.Date = Date;
};