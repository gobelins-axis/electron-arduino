class EventDispatcher {
    addEventListener(name, listener) {
        if (this._listeners === undefined) this._listeners = {};

        const listeners = this._listeners;
        if (listeners[name] === undefined) {
            listeners[name] = [];
        }

        if (!listeners[name].includes(listener)) {
            listeners[name].push(listener);
        }
    }

    removeEventListener(name, listener) {
        if (this._listeners === undefined) return;

        const listeners = this._listeners;
        const listenerArray = listeners[name];

        if (listenerArray !== undefined) {
            const index = listenerArray.indexOf(listener);

            if (index !== -1) {
                listenerArray.splice(index, 1);
            }
        }
    }

    dispatchEvent(name, data) {
        if (this._listeners === undefined) return;

        const listeners = this._listeners;
        const listenerArray = listeners[name];

        if (listenerArray !== undefined) {
            const array = listenerArray.slice(0);
            for (let i = 0, l = array.length; i < l; i++) {
                array[i].call(this, data);
            }
        }
    }
}

class Arcade extends EventDispatcher {
    constructor() {
        super();

        // Setup
        this._keys = ['a', 'b'];
        this._mappedKeys = this._setupMappedKeys();
        this._ipcRenderer = null;

        this._bindAll();
        // this._setupEventListeners();
    }

    /**
     * Static
     */
    // static ipcRenderer = null;

    /**
     * Getters
     */
    get mappedKeys() {
        return this._mappedKeys;
    }

    get ipcRenderer() {
        return this._ipcRenderer;
    }

    /**
     * Setters
     */
    set ipcRenderer(value) {
        this._ipcRenderer = value;
    }

    /**
     * Public
     */
    start() {
        this._setupEventListeners();
    }

    destroy() {
        this._removeEventListeners();
    }

    registerKey(machineKey, keyboardKey) {
        const keyIndex = this._keys.indexOf(machineKey);

        if (keyIndex === -1) {
            console.error(`Key with name "${machineKey}" is not available`);
            return;
        }

        this._mappedKeys[this._keys[keyIndex]].keyboardKey = keyboardKey;
        
        return this._mappedKeys[this._keys[keyIndex]];
    }



    /**
     * Private
     */
    _setupMappedKeys() {
        const mappedKeys = {};

        for (let i = 0; i < this._keys.length; i++) {
            const key = this._keys[i];
            mappedKeys[key] = {
                machineKey: key,
                keyboardKey: null,
                isPressed: false,
            };
        }

        return mappedKeys;
    }

    _bindAll() {
        // Public
        this.registerKey = this.registerKey.bind(this);
        this.destroy = this.destroy.bind(this);
        this.addEventListener = this.addEventListener.bind(this);
        this.removeEventListener = this.removeEventListener.bind(this);

        // Private
        this._keydownHandler = this._keydownHandler.bind(this);
        this._keyupHandler = this._keyupHandler.bind(this);
        this._machineKeydownHandler = this._machineKeydownHandler.bind(this);
        this._machineKeyupHandler = this._machineKeyupHandler.bind(this);
    }

    _setupEventListeners() {
        window.addEventListener('keydown', this._keydownHandler);
        window.addEventListener('keyup', this._keyupHandler);

        this._ipcRenderer?.on('keydown', this._machineKeydownHandler);
        this._ipcRenderer?.on('keyup', this._machineKeyupHandler);
    }
    
    _removeEventListeners() {
        window.removeEventListener('keydown', this._keydownHandler);
        window.removeEventListener('keyup', this._keyupHandler);
    }

    _keydownHandler(e) {
        for (const mappedKey in this._mappedKeys) {
            if (this._mappedKeys[mappedKey].keyboardKey === e.key) {
                this._mappedKeys[mappedKey].isPressed = true;
                this.dispatchEvent('keydown', this._mappedKeys[mappedKey]);
            };
        }
    }
    
    _keyupHandler(e) {
        for (const mappedKey in this._mappedKeys) {
            if (this._mappedKeys[mappedKey].keyboardKey === e.key) {
                this._mappedKeys[mappedKey].isPressed = false;
                this.dispatchEvent('keyup', this._mappedKeys[mappedKey]);
            };
        }
    }

    _machineKeydownHandler(event, key) {
        for (const mappedKey in this._mappedKeys) {
            if (this._mappedKeys[mappedKey].machineKey === key) {
                this._mappedKeys[mappedKey].isPressed = true;
                this.dispatchEvent('keydown', this._mappedKeys[mappedKey]);
            };
        }
    }

    _machineKeyupHandler(event, key) {
        for (const mappedKey in this._mappedKeys) {
            if (this._mappedKeys[mappedKey].machineKey === key) {
                this._mappedKeys[mappedKey].isPressed = false;
                this.dispatchEvent('keyup', this._mappedKeys[mappedKey]);
            };
        }
    }
}

// export default window.__arcadeFeu || new Arcade();
module.exports = window.__arcadeFeu || new Arcade();

// Demo
// const arcade = new Arcade();
// const keyA = arcade.registerKey('a', 'ArrowLeft');
// const keyB = arcade.registerKey('b', 'ArrowRight');
