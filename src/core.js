// core.js

// Note: this is a sub module of the abge namespace
// the abge namespace is accessed through the 'me' variable
// which is defined in the BEGIN.js file

Core = (function (core) {

    /// "Laser Cannon Grapple" -> ['Laser', 'Cannon', 'Grapple']
    core.transformSelectors = function transformSelectors(selector) {
        if (typeof(selector) === "string") {
            selector = selector.split(" ");
        }
        return selector;
    };


    function ComponentEntityManager() {
        var t = this,
            GUID = 0,
            entities = {},
            components = {};

        /// generate unique ID
        t.uniqueID = function() {
            GUID = GUID + 1;
            return GUID;
        };

        /// add a component which entities can use
        t.c = t.addComponent = function(id, component) {
            components[id] = component;
            return t;
        };

        /// remove component
        t.removeComponent = function(id) {
            delete components[id];
            return t;
        };

        /// create new entity
        t.e = t.createEntity = function() {
            var id = t.uniqueID(),
                entity = null;

            entity = Entity.createEntity(id);
            if (arguments.length > 0) {
                entity.requires.apply(entity, arguments);
            }
            entity.requires(['bgo']);
            entities[id] = entity;
            return entity;
        };

        /// remove an entity
        t.r = t.removeEntity = function(entity) {
            delete entities[entity.id];
            return t;
        };

        /// get entities which contain all specified components
        t.s = t.select = function(selector) {
            var entityID, selectorID,
                entity, component,
                pass,
                collected = [];

            selector = transformSelectors(selector);

            for (entityID in entities) {
                entity = entities[entityID];
                pass = true;
                for (selectorID in selector) {
                    component = selector[selectorID];
                    if (entity.type.indexOf(component) < 0) {
                        pass = false;
                        break;
                    }
                }
                if (pass) {
                    collected.push(entity);
                }
            }

            return collected;
        };

        t.getComponents = function() {
            var c, list = [];
            for (c in components) {
                list.push(c);
            }
            return list;
        };

        // base game object component
        t.addComponent('bgo', {});
    }

    core.cem = ComponentEntityManager;

    return core;
}(Core || {}));
