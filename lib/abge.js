/*
         _                   _               _              _
        / /\                / /\            /\ \           /\ \
       / /  \              / /  \          /  \ \         /  \ \
      / / /\ \            / / /\ \        / /\ \_\       / /\ \ \
     / / /\ \ \          / / /\ \ \      / / /\/_/      / / /\ \_\
    / / /  \ \ \        / / /\ \_\ \    / / / ______   / /_/_ \/_/
   / / /___/ /\ \      / / /\ \ \___\  / / / /\_____\ / /____/\
  / / /_____/ /\ \    / / /  \ \ \__/ / / /  \/____ // /\____\/
 / /_________/\ \ \  / / /____\_\ \  / / /_____/ / // / /______
/ / /_       __\ \_\/ / /__________\/ / /______\/ // / /_______\
\_\___\     /____/_/\/_____________/\/___________/ \/__________/

                             _        _
                            /\ \     / /\
                            \ \ \   / /  \
                            /\ \_\ / / /\ \__
                           / /\/_// / /\ \___\
                  _       / / /   \ \ \ \/___/
                 /\ \    / / /     \ \ \
                 \ \_\  / / /  _    \ \ \
             _   / / /_/ / /  /_/\__/ / /
            /\_\/ / /__\/ /   \ \/___/ /
            \/_/\/_______/     \_____\/

                Copyright (c) 2014 Richard Marks,
                   http://www.ccpssolutions.com

            Copyright (c) 2014 Bang Bang Attack Studios,
                http://www.bangbangattackstudios.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


// begin the abge namespace
var abge = (function (me) {

    // modules
    var Anim,
        Component,
        Core,
        Entity,
        Event,
        Input,
        Layer,
        Scene,
        Sprite,
        Timer;

// this file intentionally does not close the above code
// END.js will close the brace and parentheses
// anim.js

// Note: this is a sub module of the abge namespace
// the abge namespace is accessed through the 'me' variable
// which is defined in the BEGIN.js file

Anim = (function (anim) {

    return anim;
}(Anim || {}));
// component.js

// Note: this is a sub module of the abge namespace
// the abge namespace is accessed through the 'me' variable
// which is defined in the BEGIN.js file

Component = (function (component) {

    return component;
}(Component || {}));
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
// event.js

// Note: this is a sub module of the abge namespace
// the abge namespace is accessed through the 'me' variable
// which is defined in the BEGIN.js file

Event = (function (event) {

    return event;
}(Event || {}));
// input.js

// Note: this is a sub module of the abge namespace
// the abge namespace is accessed through the 'me' variable
// which is defined in the BEGIN.js file

Input = (function (input) {

    return input;
}(Input || {}));
// layer.js

// Note: this is a sub module of the abge namespace
// the abge namespace is accessed through the 'me' variable
// which is defined in the BEGIN.js file

Layer = (function (layer) {

    return layer;
}(Layer || {}));
// scene.js

// Note: this is a sub module of the abge namespace
// the abge namespace is accessed through the 'me' variable
// which is defined in the BEGIN.js file

Scene = (function (scene) {

    return scene;
}(Scene || {}));
// sprite.js

// Note: this is a sub module of the abge namespace
// the abge namespace is accessed through the 'me' variable
// which is defined in the BEGIN.js file

Sprite = (function (sprite) {

    return sprite;
}(Sprite || {}));
// timer.js

// Note: this is a sub module of the abge namespace
// the abge namespace is accessed through the 'me' variable
// which is defined in the BEGIN.js file

Timer = (function (timer) {

    return timer;
}(Timer || {}));
// end the abge namespace

// this file intentionally does not open the following code
// as BEGIN.js is where this code is started.

    // export modules
    me.Anim = Anim;
    me.Component = Component;
    me.Core = Core;
    me.Entity = Entity;
    me.Event = Event;
    me.Input = Input;
    me.Layer = Layer;
    me.Scene = Scene;
    me.Sprite = Sprite;
    me.Timer = Timer;

    return me;
}(abge || {}));
