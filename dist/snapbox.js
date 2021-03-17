import React, { useState, useEffect } from 'react';


// React hook for getting the viewport dimensions
function useWindowDimensions() {

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() { setWindowDimensions(getWindowDimensions()); }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}


// gets coordinates of snap in the given lrtb-bounding box (position)
function get_snap_coordinates(position, snap) {
  let coordinates = {};
  if (snap.includes('t')) {
    coordinates.y = position.top;
  }
  else if (snap.includes('b')) {
    coordinates.y = position.bottom;
  }
  else {
    coordinates.y = (position.top + position.bottom) / 2;
  }

  if (snap.includes('l')) {
    coordinates.x = position.left;
  }
  else if (snap.includes('r')) {
    coordinates.x = position.right;
  }
  else {
    coordinates.x = (position.left + position.right) / 2;
  }

  return coordinates;
}

// anchors sides to their snaps and sets reflection coordinates for center snaps
function add_anchors_and_reflections(anchors_and_reflections, snap, location) {
  if (snap.includes('c') && !(snap.includes('l') || snap.includes('r'))) {
    if (typeof(anchors_and_reflections.reflect_leftright) !== 'undefined') console.log('Snaps may directly conflict, be careful with undefined behaviour');
    else if (typeof(anchors_and_reflections.anchor_left) !== 'undefined' && typeof(anchors_and_reflections.anchor_right) !== 'undefined') console.log('Snaps may indirectly conflict, be careful with undefined behaviour');

    anchors_and_reflections['reflect_leftright'] = location.x;
  }
  if (snap.includes('c') && !(snap.includes('t') || snap.includes('b'))) {
    if (typeof(anchors_and_reflections.reflect_topbottom) !== 'undefined') console.log('Snaps may directly conflict, be careful with undefined behaviour');
    else if (typeof(anchors_and_reflections.anchor_top) !== 'undefined' && typeof(anchors_and_reflections.anchor_bottom) !== 'undefined') console.log('Snaps may indirectly conflict, be careful with undefined behaviour');

    anchors_and_reflections['reflect_topbottom'] = location.y;
  }

  if (snap.includes('t')) {
    if (typeof(anchors_and_reflections.anchor_top) !== 'undefined') console.log('Snaps may directly conflict, be careful with undefined behaviour');
    else if (typeof(anchors_and_reflections.anchor_bottom) !== 'undefined' && typeof(anchors_and_reflections.reflect_topbottom) !== 'undefined') console.log('Snaps may indirectly conflict, be careful with undefined behaviour');

    anchors_and_reflections['anchor_top'] = location.y;
  }
  if (snap.includes('b')) {
    if (typeof(anchors_and_reflections.anchor_bottom) !== 'undefined') console.log('Snaps may directly conflict, be careful with undefined behaviour');
    else if (typeof(anchors_and_reflections.anchor_top) !== 'undefined' && typeof(anchors_and_reflections.reflect_topbottom) !== 'undefined') console.log('Snaps may indirectly conflict, be careful with undefined behaviour');

    anchors_and_reflections['anchor_bottom'] = location.y;
  }
  if (snap.includes('l')) {
    if (typeof(anchors_and_reflections.anchor_left) !== 'undefined') console.log('Snaps may directly conflict, be careful with undefined behaviour');
    else if (typeof(anchors_and_reflections.anchor_right) !== 'undefined' && typeof(anchors_and_reflections.reflect_leftright) !== 'undefined') console.log('Snaps may indirectly conflict, be careful with undefined behaviour');

    anchors_and_reflections['anchor_left'] = location.x;
  }
  if (snap.includes('r')) {
    if (typeof(anchors_and_reflections.anchor_right) !== 'undefined') console.log('Snaps may directly conflict, be careful with undefined behaviour');
    else if (typeof(anchors_and_reflections.anchor_left) !== 'undefined' && typeof(anchors_and_reflections.reflect_leftright) !== 'undefined') console.log('Snaps may indirectly conflict, be careful with undefined behaviour');

    anchors_and_reflections['anchor_right'] = location.x;
  }
}

// gets the initial dimensions of the snapbox to be translated from viewport or props
function get_initial_dimensions(dimensions, parentPosition, mainPosition) {
  let { width, height } = dimensions;

  if (typeof(width) === 'number')                                             // % of viewport
    width = width * mainPosition.width;
  else if (typeof(width) === 'string') {
    if (/^[0-9]+px$/.test(width))                                             // px
      width = parseInt(width.slice(0, -2));
    else if (/^[0-9]+(?:.[0-9]+)?%$/.test(width))                             // % of parent
      width = parseFloat(width.slice(0, -1)) / 100 * parentPosition.width;
    else if (/^[0-9]+(?:.[0-9]+)?$/.test(width))                              // % of viewport
      width = parseFloat(width) / 100 * mainPosition.width;
  }

  if (typeof(height) === 'number')                                            // % of viewport
    height = height * mainPosition.height;
  else if (typeof(height) === 'string') {
    if (/^[0-9]+px$/.test(height))                                            // px
      height = parseInt(height.slice(0, -2));
    else if (/^[0-9]+(?:.[0-9]+)?%$/.test(height))                            // % of parent
      height = parseFloat(height.slice(0, -1)) / 100 * parentPosition.height;
    else if (/^[0-9]+(?:.[0-9]+)?$/.test(height))                             // % of viewport
      height = parseFloat(height) / 100 * mainPosition.height;
  }

  return { width, height };
}

// calculates final lrtb-bounding box for snapbox from anchors/reflections and initial dimensions
function get_final_position(dimensions, anchors_and_reflections) {
  let pos = {
    left: 0,
    top: 0,
    right: typeof(dimensions.width) === 'undefined' ? 0 : dimensions.width,
    bottom: typeof(dimensions.height) === 'undefined' ? 0 : dimensions.height,
    width: dimensions.width,
    height: dimensions.height,
  };

  if (typeof(anchors_and_reflections.reflect_topbottom) !== 'undefined') {
    let translation = anchors_and_reflections.reflect_topbottom - (pos.bottom - pos.top) / 2;
    pos.top += translation;
    pos.bottom += translation;
  }
  if (typeof(anchors_and_reflections.reflect_leftright) !== 'undefined') {
    let translation = anchors_and_reflections.reflect_leftright - (pos.right - pos.left) / 2;
    pos.left += translation;
    pos.right += translation;
  }
  if (typeof(anchors_and_reflections.anchor_top) !== 'undefined') {
    pos.top = anchors_and_reflections.anchor_top;
    if (typeof(anchors_and_reflections.reflect_topbottom) !== 'undefined')
      pos.bottom = 2*anchors_and_reflections.reflect_topbottom - anchors_and_reflections.anchor_top;
    else if (typeof(pos.height) !== 'undefined')
      pos.bottom = anchors_and_reflections.anchor_top + pos.height;
  }
  if (typeof(anchors_and_reflections.anchor_bottom) !== 'undefined') {
    pos.bottom = anchors_and_reflections.anchor_bottom;
    if (typeof(anchors_and_reflections.reflect_topbottom) !== 'undefined')
      pos.top = 2*anchors_and_reflections.anchor_bottom - anchors_and_reflections.reflect_topbottom;
    else if (typeof(pos.height) !== 'undefined')
      pos.top = anchors_and_reflections.anchor_bottom - pos.height;
  }
  if (typeof(anchors_and_reflections.anchor_left) !== 'undefined') {
    pos.left = anchors_and_reflections.anchor_left;
    if (typeof(anchors_and_reflections.reflect_leftright) !== 'undefined')
      pos.right = 2*anchors_and_reflections.reflect_leftright - anchors_and_reflections.anchor_left;
    else if (typeof(pos.width) !== 'undefined')
      pos.right = anchors_and_reflections.anchor_left + pos.width;
  }
  if (typeof(anchors_and_reflections.anchor_right) !== 'undefined') {
    pos.right = anchors_and_reflections.anchor_right;
    if (typeof(anchors_and_reflections.reflect_leftright) !== 'undefined')
      pos.left = 2*anchors_and_reflections.anchor_right - anchors_and_reflections.reflect_leftright;
    else if (typeof(pos.width) !== 'undefined')
      pos.left = anchors_and_reflections.anchor_right - pos.width;
  }

  pos.width = pos.right - pos.left;
  pos.height = pos.bottom - pos.top;

  return pos;
}


function Snapbox(props) {

  console.log('snapping ' + props.name + '...');

  let anchors_and_reflections = {};
  if (!props.main) {
    Object.entries(props.snaps).forEach(([snap, location]) => {
      if (snap === 'width' || snap === 'height') return;

      const [parent, parent_snap] = location.split(' ');

      let parent_snap_location = get_snap_coordinates(props.parentPositions[parent], parent_snap);

      add_anchors_and_reflections(anchors_and_reflections, snap, parent_snap_location);
    });
  }

  let position;
  let viewport_dimensions = useWindowDimensions();
  if (!props.main) {
    let dimensions = get_initial_dimensions(props.snaps, props.parentPositions[props.parent], props.parentPositions['main']);
    position = get_final_position(dimensions, anchors_and_reflections);
  }
  else {
    position = get_final_position(viewport_dimensions, anchors_and_reflections);
  }


  let parentPositions = {...props.parentPositions};
  parentPositions[props.name] = position;

  let snapbox_children = [];
  let other_children = [];
  React.Children.forEach(props.children, (child, index) => {
    if (child.props.is_snapbox) {
      snapbox_children.push(React.cloneElement(child, {parentPositions: parentPositions, parent: props.name, key: props.name + String(index)}));
    }
    else other_children.push(child);
  });

  let css = {
    left: position.left,
    top: position.top,
    width: position.width,
    height: position.height,
    position: 'fixed',
  };
  if (props.main) {
    if (other_children.length) {
      return (
        <div snapboxname={props.name} style={css} snapboxmain='true'>
          {<div style={{height: '100%', width: '100%', ...props.divStyles}}>
            {other_children}
          </div>}
          {snapbox_children}
        </div>
      );
    }
    else {
      return (
        <div snapboxname={props.name} style={css} snapboxmain='true'>
          {snapbox_children}
        </div>
      );
    }
  }
  else {
    if (other_children.length) {
      return (
        <div snapboxname={props.name} style={css}>
          {<div style={{height: '100%', width: '100%', ...props.divStyles}}>
            {other_children}
          </div>}
          {snapbox_children}
        </div>
      );
    }
    else {
      return (
        <div snapboxname={props.name} style={css}>
          {snapbox_children}
        </div>
      );
    }
  }
}

Snapbox.defaultProps = {
  is_snapbox: true,
  name: 'main',
  parentPositions: {},
  snaps: {},
};


export default Snapbox;
