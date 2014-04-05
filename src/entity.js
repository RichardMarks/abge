// entity.js

// Note: this is a sub module of the abge namespace
// the abge namespace is accessed through the 'me' variable
// which is defined in the BEGIN.js file

Entity = (function (entity) {

    function EntityObject(id) {
        var t = this,
            state = {};

        t.id = id;
        t.type = [];

        /// extend entity adding new states and methods from base
        t.extend = function(base) {
            var self = this,
                key;

            if (base === void 0 || !base) {
                return self;
            }

            function handleFn(key, base) {
                self.set(key, base[key]);
                self.__defineGetter__(key, function() {
                    return self.get(key);
                });

                self.__defineSetter__(key, function(value) {
                    self.set(key, value);
                });
            }

            for (key in base) {
                if (base[key] === self) {
                    continue;
                }

                if (typeof base[key] !== "function") {
                    handleFn(key, base);
                } else {
                    self[key] = base[key];
                }
            }

            return self;
        };

        /// add components to entity
        t.requires = function(selector) {
            var selectorID,
                component,
                sel;

            selector = Core.transformSelectors(selector);

            for (selectorID in selector) {
                sel = selector[selectorID];
                component = components[sel];
                if (t.type.indexOf(sel) < 0 && component) {
                    t.type.push(sel);
                    t.extend(component);
                }
            }

            return t;
        };

        /// get a value from the state table
        t.get = function(key) {
            return state[key];
        };

        /// set a value in the state table
        t.set = function(key, value) {
            state[key] = value;
            return t;
        };
    }

    entity.createEntity = function(id) {
        return new EntityObject(id);
    };

    return entity;
}(Entity || {}));
