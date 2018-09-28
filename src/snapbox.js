import React, { Component } from 'react'

// import injectSheet, { ThemeProvider } from 'react-jss'
import PropTypes from 'prop-types'

class Snapbox extends Component {
  static defaultProps = {
    snaps: [],
    processedsnaps: [],
    mountCallback: null,
    is_snapbox: true,
  }
  constructor(props) {
    super(props)
    this.state = {
      first_render: true,
      top: 0,
      left: 0,
      width: null,
      height: null,
      rendered: false,
      siblings: [],
      snapchildren: {},
      refchildren: [],
      refclassname: React.createRef(),
    }
  }
  render() {
    // on first render, pass the proper props to children and get refs from non-snapbox children
    if (this.state.first_render) {
      // console.log(this.props.name + ' did first render')
      this.state.first_render = false
      return (
        <div style={{position: 'absolute', overflow: 'hidden', top: this.state.top, left: this.state.left, height: this.state.height, width: this.state.width}}>
          <div className={this.props.className} ref={this.state.refclassname}>
            {
              React.Children.map(this.props.children, (child) => {
                if (child.props.is_snapbox) {
                  return React.cloneElement(child, {mountCallback: this.childCallback})
                }
                return React.cloneElement(child, {ref: (r) => { this.state.refchildren.push(r) }})
              })
            }
          </div>
        </div>
      )
    }
    // console.log(this.props.name + ' did render')
    let center, topleft, topright, bottomleft, bottomright, centerset, xset, yset
    center = false
    topleft = {x: null, y: null}
    topright = {x: null, y: null}
    bottomleft = {x: null, y: null}
    bottomright = {x: null, y: null}
    centerset = xset = yset = false
    this.props.processedsnaps.forEach((snap) => {
      let point = snap.locator(snap.snappoint)
      // console.log(this.props.name + ' snapped ' + snap.localpoint + ' to ' + snap.snappoint)
      if (snap.localpoint.includes('top')) {
        yset = true
        if (!snap.localpoint.includes('left')) { topright.y = point.y }
        if (!snap.localpoint.includes('right')) { topleft.y = point.y }
      }
      else if (snap.localpoint.includes('bottom')) {
        yset = true
        if (!snap.localpoint.includes('left')) { bottomright.y = point.y }
        if (!snap.localpoint.includes('right')) { bottomleft.y = point.y }
      }
      if (snap.localpoint.includes('left')) {
        xset = true
        if (!snap.localpoint.includes('top')) { bottomleft.x = point.x }
        if (!snap.localpoint.includes('bottom')) { topleft.x = point.x }
      }
      else if (snap.localpoint.includes('right')) {
        xset = true
        if (!snap.localpoint.includes('top')) { bottomright.x = point.x }
        if (!snap.localpoint.includes('bottom')) { topright.x = point.x }
      }
      if (snap.localpoint === 'center') { center = point; centerset = true }
    })
    // first, top left and top right have to have the same y, the max of the two and so on, but only if that value was actually set
    topleft.y = topright.y = Math.max(topleft.y, topright.y)
    bottomleft.y = bottomright.y = bottomleft.y === null ? bottomright.y === null ? 0 : bottomright.y : bottomright.y === null ? bottomrleft.y : Math.min(bottomleft.y, bottomright.y)
    topleft.x = bottomleft.x = Math.max(topleft.x, bottomleft.x)
    topright.x = bottomright.x = topright.x === null ? bottomright.x === null ? 0 : bottomright.x : bottomright.x === null ? topright.x : Math.min(topright.x, bottomright.x)
    // if center was defined, get the distance from the center to each edge
    // if there was a center defined, shrink the box to put it in the middle
    if (centerset) {
      let minheight, minwidth // both half the minimum height and minimum width
      if (yset) { minheight = Math.min(center.y - topleft.y, bottomleft.y - center.y) }
      else { minheight = this.state.height / 2 }
      topleft.y = topright.y = center.y - minheight
      bottomleft.y = bottomright.y = center.y + minheight
      if (xset) { minwidth = Math.min(center.x - topleft.x, topright.x - center.x) }
      else { minwidth = this.state.width / 2 }
      topleft.x = bottomleft.x = center.x - minwidth
      topright.x = bottomright.x = center.x + minwidth
    }
    // if the box is now not large enough to accomodate its children, increase its size uniformly on all sides
    let xdiff = topright.x - topleft.x
    if (xdiff < this.state.width) {
      topleft.x = bottomleft.x = topleft.x - (this.state.width - xdiff) / 2
      topright.x = bottomright.x = topright.x + (this.state.width + xdiff) / 2
    }
    let ydiff = bottomleft.y - topleft.y
    if (ydiff < this.state.height) {
      topleft.y = topright.y = topleft.y - (this.state.height - ydiff) / 2
      bottomleft.y = bottomright.y = bottomleft.y - (this.state.height + ydiff) / 2
    }
    if (centerset || xset || yset) {
      this.state.top = topleft.y
      this.state.left = topleft.x
      this.state.height = bottomleft.y - topleft.y
      this.state.width = topright.x - topleft.x
    }
    return(
      <div style={{position: 'absolute', overflow: 'hidden', top: this.state.top, left: this.state.left, height: this.state.height, width: this.state.width}}>
        <div className={this.props.className} ref={this.state.refclassname}>
          {
            React.Children.map(this.props.children, (child) => {
              if (child.props.is_snapbox) {
                return React.cloneElement(child, {mountCallback: this.childCallback, processedsnaps: child.props.snaps.map((snap) => {
                  if (snap.locator === 'parent') {
                    return {
                      locator: this.getPointPositionForChildren,
                      localpoint: snap.localpoint,
                      snappoint: snap.snappoint,
                    }
                  }
                  return {
                    locator: this.state.snapchildren[snap.locator],
                    localpoint: snap.localpoint,
                    snappoint: snap.snappoint,
                  }
                })})
              }
              return React.cloneElement(child, {ref: (r) => { this.state.refchildren.push(r) }})
            })
          }
        </div>
      </div>
    )
    // on second render and beyond, calculate new position based on snappoints since width and height are already found, and process snaps of children
  }
  componentDidMount() {
    // updateDimensions() to get initial size and then add window resize listener
    // console.log(this.props.name + ' did mount')
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
  }
  componentWillUnmount() {
    // removes the window resize listener
    window.removeEventListener("resize", this.updateDimensions)
  }
  childCallback = (name, partialState, childGetPointPosition) => {
    // takes in/receives a name and getPointPosition which are saved to snapchildren
    this.state.snapchildren[name] = childGetPointPosition
    // partialState is used to update dimensions and rerender
    if (this.state.width < partialState.width) { this.state.width = partialState.width }
    if (this.state.height < partialState.height) { this.state.height = partialState.height }
  }
  updateDimensions = () => {
    // reset the height and width of the component for new calculations
    this.state.width = this.state.height = 0
    // goes through ref children, finds its width and height based on that
    this.state.refchildren.forEach((node) => {
      if (this.state.width < node.offsetWidth) { this.state.width = node.offsetWidth }
      if (this.state.height < node.offsetHeight) { this.state.height = node.offsetHeight }
    })
    if (this.state.refclassname.current !== null) {
      if (this.state.width < this.state.refclassname.current.offsetWidth) { this.state.width = this.state.refclassname.current.offsetWidth }
      if (this.state.height < this.state.refclassname.current.offsetHeight) { this.state.height = this.state.refclassname.current.offsetHeight }
    }
    // callsback to its parent so that its parent can update its own width and height which causes a rerender
    if (this.props.mountCallback !== null) {
      this.props.mountCallback(this.props.name, {width: this.state.width, height: this.state.height}, this.getPointPosition)
    }
    else {
      this.setState({})
    }
    // does not need to rerender itself since it will be replaced by a cloned element with populated props
  }
  getPointPosition = (snapPoint) => {
    // takes in a snappoint and returns that points coordinates
    let pointPosition = {x: 0, y: 0}
    if (snapPoint.includes('top')) {
      pointPosition.y = this.state.top
    }
    else if (snapPoint.includes('bottom')) {
      pointPosition.y = this.state.top + this.state.height
    }
    else {
      pointPosition.y = this.state.top + this.state.height / 2
    }
    if (snapPoint.includes('left')) {
      pointPosition.x = this.state.left
    }
    else if (snapPoint.includes('right')) {
      pointPosition.x = this.state.left + this.state.width
    }
    else {
      pointPosition.x = this.state.left + this.state.width / 2
    }
    return pointPosition
  }
  getPointPositionForChildren = (snapPoint) => {
    let pointPosition = {x: 0, y: 0}
    if (snapPoint.includes('top')) {
      pointPosition.y = 0
    }
    else if (snapPoint.includes('bottom')) {
      pointPosition.y = this.state.height
    }
    else {
      pointPosition.y = this.state.height / 2
    }
    if (snapPoint.includes('left')) {
      pointPosition.x = 0
    }
    else if (snapPoint.includes('right')) {
      pointPosition.x = this.state.width
    }
    else {
      pointPosition.x = this.state.width / 2
    }
    return pointPosition
  }
}

Snapbox.propTypes = {
  name: PropTypes.string,
  snaps: PropTypes.arrayOf(
    PropTypes.shape({
      locator: PropTypes.string,
      localpoint: PropTypes.oneOf(['top', 'left', 'center', 'right', 'bottom', 'topleft', 'topright', 'bottomright', 'bottomleft']),
      snappoint: PropTypes.oneOf(['top', 'left', 'center', 'right', 'bottom', 'topleft', 'topright', 'bottomright', 'bottomleft']),
    })
  ),
  //parent info not to be passed by the user
  processedsnaps: PropTypes.arrayOf(
    PropTypes.shape({
      locator: PropTypes.func, // this is the getPointPosition of the locator from snaps
      localpoint: PropTypes.oneOf(['top', 'left', 'center', 'right', 'bottom', 'topleft', 'topright', 'bottomright', 'bottomleft']),
      snappoint: PropTypes.oneOf(['top', 'left', 'center', 'right', 'bottom', 'topleft', 'topright', 'bottomright', 'bottomleft']),
    })
  ),
  mountCallback: PropTypes.func,
  //default identified props
  is_snapbox: PropTypes.bool,
}

export default Snapbox
