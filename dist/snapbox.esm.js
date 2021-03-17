import React, { useState, useEffect } from 'react';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function useWindowDimensions() {
  function getWindowDimensions() {
    var _window = window,
        width = _window.innerWidth,
        height = _window.innerHeight;
    return {
      width: width,
      height: height
    };
  }

  var _useState = useState(getWindowDimensions()),
      _useState2 = _slicedToArray(_useState, 2),
      windowDimensions = _useState2[0],
      setWindowDimensions = _useState2[1];

  useEffect(function () {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return function () {
      return window.removeEventListener('resize', handleResize);
    };
  }, []);
  return windowDimensions;
} // gets coordinates of snap in the given lrtb-bounding box (position)


function get_snap_coordinates(position, snap) {
  var coordinates = {};

  if (snap.includes('t')) {
    coordinates.y = position.top;
  } else if (snap.includes('b')) {
    coordinates.y = position.bottom;
  } else {
    coordinates.y = (position.top + position.bottom) / 2;
  }

  if (snap.includes('l')) {
    coordinates.x = position.left;
  } else if (snap.includes('r')) {
    coordinates.x = position.right;
  } else {
    coordinates.x = (position.left + position.right) / 2;
  }

  return coordinates;
} // anchors sides to their snaps and sets reflection coordinates for center snaps


function add_anchors_and_reflections(anchors_and_reflections, snap, location) {
  if (snap.includes('c') && !(snap.includes('l') || snap.includes('r'))) {
    if (typeof anchors_and_reflections.reflect_leftright !== 'undefined') console.log('Snaps may directly conflict, be careful with undefined behaviour');else if (typeof anchors_and_reflections.anchor_left !== 'undefined' && typeof anchors_and_reflections.anchor_right !== 'undefined') console.log('Snaps may indirectly conflict, be careful with undefined behaviour');
    anchors_and_reflections['reflect_leftright'] = location.x;
  }

  if (snap.includes('c') && !(snap.includes('t') || snap.includes('b'))) {
    if (typeof anchors_and_reflections.reflect_topbottom !== 'undefined') console.log('Snaps may directly conflict, be careful with undefined behaviour');else if (typeof anchors_and_reflections.anchor_top !== 'undefined' && typeof anchors_and_reflections.anchor_bottom !== 'undefined') console.log('Snaps may indirectly conflict, be careful with undefined behaviour');
    anchors_and_reflections['reflect_topbottom'] = location.y;
  }

  if (snap.includes('t')) {
    if (typeof anchors_and_reflections.anchor_top !== 'undefined') console.log('Snaps may directly conflict, be careful with undefined behaviour');else if (typeof anchors_and_reflections.anchor_bottom !== 'undefined' && typeof anchors_and_reflections.reflect_topbottom !== 'undefined') console.log('Snaps may indirectly conflict, be careful with undefined behaviour');
    anchors_and_reflections['anchor_top'] = location.y;
  }

  if (snap.includes('b')) {
    if (typeof anchors_and_reflections.anchor_bottom !== 'undefined') console.log('Snaps may directly conflict, be careful with undefined behaviour');else if (typeof anchors_and_reflections.anchor_top !== 'undefined' && typeof anchors_and_reflections.reflect_topbottom !== 'undefined') console.log('Snaps may indirectly conflict, be careful with undefined behaviour');
    anchors_and_reflections['anchor_bottom'] = location.y;
  }

  if (snap.includes('l')) {
    if (typeof anchors_and_reflections.anchor_left !== 'undefined') console.log('Snaps may directly conflict, be careful with undefined behaviour');else if (typeof anchors_and_reflections.anchor_right !== 'undefined' && typeof anchors_and_reflections.reflect_leftright !== 'undefined') console.log('Snaps may indirectly conflict, be careful with undefined behaviour');
    anchors_and_reflections['anchor_left'] = location.x;
  }

  if (snap.includes('r')) {
    if (typeof anchors_and_reflections.anchor_right !== 'undefined') console.log('Snaps may directly conflict, be careful with undefined behaviour');else if (typeof anchors_and_reflections.anchor_left !== 'undefined' && typeof anchors_and_reflections.reflect_leftright !== 'undefined') console.log('Snaps may indirectly conflict, be careful with undefined behaviour');
    anchors_and_reflections['anchor_right'] = location.x;
  }
} // gets the initial dimensions of the snapbox to be translated from viewport or props


function get_initial_dimensions(dimensions, parentPosition, mainPosition) {
  var width = dimensions.width,
      height = dimensions.height;
  if (typeof width === 'number') // % of viewport
    width = width * mainPosition.width;else if (typeof width === 'string') {
    if (/^[0-9]+px$/.test(width)) // px
      width = parseInt(width.slice(0, -2));else if (/^[0-9]+(?:.[0-9]+)?%$/.test(width)) // % of parent
      width = parseFloat(width.slice(0, -1)) / 100 * parentPosition.width;else if (/^[0-9]+(?:.[0-9]+)?$/.test(width)) // % of viewport
      width = parseFloat(width) / 100 * mainPosition.width;
  }
  if (typeof height === 'number') // % of viewport
    height = height * mainPosition.height;else if (typeof height === 'string') {
    if (/^[0-9]+px$/.test(height)) // px
      height = parseInt(height.slice(0, -2));else if (/^[0-9]+(?:.[0-9]+)?%$/.test(height)) // % of parent
      height = parseFloat(height.slice(0, -1)) / 100 * parentPosition.height;else if (/^[0-9]+(?:.[0-9]+)?$/.test(height)) // % of viewport
      height = parseFloat(height) / 100 * mainPosition.height;
  }
  return {
    width: width,
    height: height
  };
} // calculates final lrtb-bounding box for snapbox from anchors/reflections and initial dimensions


function get_final_position(dimensions, anchors_and_reflections) {
  var pos = {
    left: 0,
    top: 0,
    right: typeof dimensions.width === 'undefined' ? 0 : dimensions.width,
    bottom: typeof dimensions.height === 'undefined' ? 0 : dimensions.height,
    width: dimensions.width,
    height: dimensions.height
  };

  if (typeof anchors_and_reflections.reflect_topbottom !== 'undefined') {
    var translation = anchors_and_reflections.reflect_topbottom - (pos.bottom - pos.top) / 2;
    pos.top += translation;
    pos.bottom += translation;
  }

  if (typeof anchors_and_reflections.reflect_leftright !== 'undefined') {
    var _translation = anchors_and_reflections.reflect_leftright - (pos.right - pos.left) / 2;

    pos.left += _translation;
    pos.right += _translation;
  }

  if (typeof anchors_and_reflections.anchor_top !== 'undefined') {
    pos.top = anchors_and_reflections.anchor_top;
    if (typeof anchors_and_reflections.reflect_topbottom !== 'undefined') pos.bottom = 2 * anchors_and_reflections.reflect_topbottom - anchors_and_reflections.anchor_top;else if (typeof pos.height !== 'undefined') pos.bottom = anchors_and_reflections.anchor_top + pos.height;
  }

  if (typeof anchors_and_reflections.anchor_bottom !== 'undefined') {
    pos.bottom = anchors_and_reflections.anchor_bottom;
    if (typeof anchors_and_reflections.reflect_topbottom !== 'undefined') pos.top = 2 * anchors_and_reflections.anchor_bottom - anchors_and_reflections.reflect_topbottom;else if (typeof pos.height !== 'undefined') pos.top = anchors_and_reflections.anchor_bottom - pos.height;
  }

  if (typeof anchors_and_reflections.anchor_left !== 'undefined') {
    pos.left = anchors_and_reflections.anchor_left;
    if (typeof anchors_and_reflections.reflect_leftright !== 'undefined') pos.right = 2 * anchors_and_reflections.reflect_leftright - anchors_and_reflections.anchor_left;else if (typeof pos.width !== 'undefined') pos.right = anchors_and_reflections.anchor_left + pos.width;
  }

  if (typeof anchors_and_reflections.anchor_right !== 'undefined') {
    pos.right = anchors_and_reflections.anchor_right;
    if (typeof anchors_and_reflections.reflect_leftright !== 'undefined') pos.left = 2 * anchors_and_reflections.anchor_right - anchors_and_reflections.reflect_leftright;else if (typeof pos.width !== 'undefined') pos.left = anchors_and_reflections.anchor_right - pos.width;
  }

  pos.width = pos.right - pos.left;
  pos.height = pos.bottom - pos.top;
  return pos;
}

function Snapbox(props) {
  console.log('snapping ' + props.name + '...');
  var anchors_and_reflections = {};

  if (!props.main) {
    Object.entries(props.snaps).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          snap = _ref2[0],
          location = _ref2[1];

      if (snap === 'width' || snap === 'height') return;

      var _location$split = location.split(' '),
          _location$split2 = _slicedToArray(_location$split, 2),
          parent = _location$split2[0],
          parent_snap = _location$split2[1];

      var parent_snap_location = get_snap_coordinates(props.parentPositions[parent], parent_snap);
      add_anchors_and_reflections(anchors_and_reflections, snap, parent_snap_location);
    });
  }

  var position;
  var viewport_dimensions = useWindowDimensions();

  if (!props.main) {
    var dimensions = get_initial_dimensions(props.snaps, props.parentPositions[props.parent], props.parentPositions['main']);
    position = get_final_position(dimensions, anchors_and_reflections);
  } else {
    position = get_final_position(viewport_dimensions, anchors_and_reflections);
  }

  var parentPositions = _objectSpread2({}, props.parentPositions);

  parentPositions[props.name] = position;
  var snapbox_children = [];
  var other_children = [];
  React.Children.forEach(props.children, function (child, index) {
    if (child.props.is_snapbox) {
      snapbox_children.push( /*#__PURE__*/React.cloneElement(child, {
        parentPositions: parentPositions,
        parent: props.name,
        key: props.name + String(index)
      }));
    } else other_children.push(child);
  });
  var css = {
    left: position.left,
    top: position.top,
    width: position.width,
    height: position.height,
    position: 'fixed'
  };

  if (props.main) {
    if (other_children.length) {
      return /*#__PURE__*/React.createElement("div", {
        snapboxname: props.name,
        style: css,
        snapboxmain: "true"
      }, /*#__PURE__*/React.createElement("div", {
        style: _objectSpread2({
          height: '100%',
          width: '100%'
        }, props.divStyles)
      }, other_children), snapbox_children);
    } else {
      return /*#__PURE__*/React.createElement("div", {
        snapboxname: props.name,
        style: css,
        snapboxmain: "true"
      }, snapbox_children);
    }
  } else {
    if (other_children.length) {
      return /*#__PURE__*/React.createElement("div", {
        snapboxname: props.name,
        style: css
      }, /*#__PURE__*/React.createElement("div", {
        style: _objectSpread2({
          height: '100%',
          width: '100%'
        }, props.divStyles)
      }, other_children), snapbox_children);
    } else {
      return /*#__PURE__*/React.createElement("div", {
        snapboxname: props.name,
        style: css
      }, snapbox_children);
    }
  }
}

Snapbox.defaultProps = {
  is_snapbox: true,
  name: 'main',
  parentPositions: {},
  snaps: {}
};

export default Snapbox;
