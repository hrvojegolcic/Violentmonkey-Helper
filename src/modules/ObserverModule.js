const ObserverModule = function(document) {
  'use strict';

  const _timer = 500;
  const _iterationsLimit = 20;

  // TODO Rewrite all of those into promises
  // Use "watch" naming
  const onElementAppearsEvent = (selector, callback, isInfiniteLoop = false) => {
    let loopCounter = 0;
    const loopTimer = setInterval(() => {
      const target = document.querySelector(selector);
      if (target !== null && ("undefined" === typeof(target.flElementExistenceReported))) {
        if (!isInfiniteLoop) clearInterval(loopTimer);
        else target.flElementExistenceReported = true;
        callback.bind(target, target)();
      }

      if (!isInfiniteLoop && (loopCounter++ >= _iterationsLimit)) {
        clearInterval(loopTimer);
      }
    }, _timer);
  };
  const onElementDisappearsEvent = (target, callback) => {
    let loopCounter = 0;
    const loopTimer = setInterval(() => {
      if (target === null || !document.body.contains(target)) {
        clearInterval(loopTimer);
        callback();
      } else {
        ui.highlight(target, "red"); // TODO: Different highlight color?
      }

      if (loopCounter++ >= _iterationsLimit) {
        clearInterval(loopTimer);
      }
    }, _timer);
  };
  const observeElementEnabled = (element, callback) => {
    let loopCounter = 0;
    const loopTimer = setInterval(() => {
      if (!element.disabled) {
        clearInterval(loopTimer);
        callback.bind(element, element)();
      }

      if (loopCounter++ >= _iterationsLimit) {
        clearInterval(loopTimer);
      }
    }, _timer);
  };
  const elementAppearsPromise = (selector) => {
    return new Promise((resolve) => {
      onElementAppearsEvent(selector, (target) => {
        resolve(target);
      }, false);
    });  
  };
  const elementAppearsAndEnabledPromise = (selector) => { // TODO this is a messss!!
    return new Promise((resolve) => {
      onElementAppearsEvent(selector, (target) => { 
        observeElementEnabled(target, () => {
          resolve(target);
        });
      }, false);
    });  
  };
  const elementDisappearsPromise = (elem) => {
    return new Promise((resolve) => {
      onElementDisappearsEvent(elem, (target) => { resolve(target); });
    });  
  };

  return !new.target? null : {
    elementAppearsPromise,
    elementAppearsAndEnabledPromise,
    elementDisappearsPromise,
    subscribe: {
      onElementAppearsEvent,
      onElementDisappearsEvent,
    }
  };
};
