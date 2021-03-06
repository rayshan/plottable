///<reference path="../../reference.ts" />

module Plottable {
export module Interaction {
  export class Drag extends AbstractInteraction {
    private dragInitialized = false;
    private dragBehavior: D3.Behavior.Drag;
    public _origin = [0,0];
    public _location = [0,0];
    private  constrainX: (n: number) => number;
    private  constrainY: (n: number) => number;
    private ondragstart: (startLocation: Point) => void;
    private      ondrag: (startLocation: Point, endLocation: Point) => void;
    private   ondragend: (startLocation: Point, endLocation: Point) => void;

    /**
     * Constructs a Drag. A Drag will signal its callbacks on mouse drag.
     */
    constructor() {
      super();
      this.dragBehavior = d3.behavior.drag();
      this.dragBehavior.on("dragstart", () => this._dragstart());
      this.dragBehavior.on("drag",      () => this._drag     ());
      this.dragBehavior.on("dragend",   () => this._dragend  ());
    }

    /**
     * Gets the callback that is called when dragging starts.
     *
     * @returns {(startLocation: Point) => void} The callback called when dragging starts.
     */
    public dragstart(): (startLocation: Point) => void;
    /**
     * Sets the callback to be called when dragging starts.
     *
     * @param {(startLocation: Point) => any} cb If provided, the function to be called. Takes in a Point in pixels.
     * @returns {Drag} The calling Drag.
     */
    public dragstart(cb: (startLocation: Point) => any): Drag;
    public dragstart(cb?: (startLocation: Point) => any): any {
      if (cb === undefined) {
        return this.ondragstart;
      } else {
        this.ondragstart = cb;
        return this;
      }
    }

    /**
     * Gets the callback that is called during dragging.
     *
     * @returns {(startLocation: Point, endLocation: Point) => void} The callback called during dragging.
     */
    public drag(): (startLocation: Point, endLocation: Point) => void;
    /**
     * Adds a callback to be called during dragging.
     *
     * @param {(startLocation: Point, endLocation: Point) => any} cb If provided, the function to be called. Takes in Points in pixels.
     * @returns {Drag} The calling Drag.
     */
    public drag(cb: (startLocation: Point, endLocation: Point) => any): Drag;
    public drag(cb?: (startLocation: Point, endLocation: Point) => any): any {
      if (cb === undefined) {
        return this.ondrag;
      } else {
        this.ondrag = cb;
        return this;
      }
    }

    /**
     * Gets the callback that is called when dragging ends.
     *
     * @returns {(startLocation: Point, endLocation: Point) => void} The callback called when dragging ends.
     */
    public dragend(): (startLocation: Point, endLocation: Point) => void;
    /**
     * Adds a callback to be called when the dragging ends.
     *
     * @param {(startLocation: Point, endLocation: Point) => any} cb If provided, the function to be called. Takes in Points in pixels.
     * @returns {Drag} The calling Drag.
     */
    public dragend(cb: (startLocation: Point, endLocation: Point) => any): Drag;
    public dragend(cb?: (startLocation: Point, endLocation: Point) => any): any {
      if (cb === undefined) {
        return this.ondragend;
      } else {
        this.ondragend = cb;
        return this;
      }
    }

    public _dragstart(){
      var width  = this._componentToListenTo.width();
      var height = this._componentToListenTo.height();
      // the constraint functions ensure that the selection rectangle will not exceed the hit box
      var constraintFunction = (min: number, max: number) => (x: number) => Math.min(Math.max(x, min), max);
      this.constrainX = constraintFunction(0, width );
      this.constrainY = constraintFunction(0, height);
    }

    public _doDragstart() {
      if (this.ondragstart != null) {
        this.ondragstart({x: this._origin[0], y: this._origin[1]});
      }
    }

    public _drag(){
      if (!this.dragInitialized) {
        this._origin = [d3.event.x, d3.event.y];
        this.dragInitialized = true;
        this._doDragstart();
      }

      this._location = [this.constrainX(d3.event.x), this.constrainY(d3.event.y)];
      this._doDrag();
    }

    public _doDrag() {
      if (this.ondrag != null) {
        var startLocation = {x: this._origin[0], y: this._origin[1]};
        var endLocation = {x: this._location[0], y: this._location[1]};
        this.ondrag(startLocation, endLocation);
      }
    }

    public _dragend(){
      if (!this.dragInitialized) {
        return;
      }
      this.dragInitialized = false;
      this._doDragend();
    }

    public _doDragend() {
      if (this.ondragend != null) {
        var startLocation = {x: this._origin[0], y: this._origin[1]};
        var endLocation = {x: this._location[0], y: this._location[1]};
        this.ondragend(startLocation, endLocation);
      }
    }

    public _anchor(component: Component.AbstractComponent, hitBox: D3.Selection) {
      super._anchor(component, hitBox);
      hitBox.call(this.dragBehavior);
      return this;
    }

    /**
     * Sets up so that the xScale and yScale that are passed have their
     * domains automatically changed as you zoom.
     *
     * @param {QuantitativeScale} xScale The scale along the x-axis.
     * @param {QuantitativeScale} yScale The scale along the y-axis.
     * @returns {Drag} The calling Drag.
     */
    public setupZoomCallback(xScale?: Scale.AbstractQuantitative<any>, yScale?: Scale.AbstractQuantitative<any>) {
      var xDomainOriginal = xScale != null ? xScale.domain() : null;
      var yDomainOriginal = yScale != null ? yScale.domain() : null;
      var resetOnNextClick = false;

      function callback(upperLeft: Point, lowerRight: Point) {
        if (upperLeft == null || lowerRight == null) {
          if (resetOnNextClick) {
            if (xScale != null) {
              xScale.domain(xDomainOriginal);
            }
            if (yScale != null) {
              yScale.domain(yDomainOriginal);
            }
          }
          resetOnNextClick = !resetOnNextClick;
          return;
        }
        resetOnNextClick = false;
        if (xScale != null) {
          xScale.domain([xScale.invert(upperLeft.x), xScale.invert(lowerRight.x)]);
        }
        if (yScale != null) {
          yScale.domain([yScale.invert(lowerRight.y), yScale.invert(upperLeft.y)]);
        }
        this.clearBox();
        return;
      }
      this.drag(callback);
      this.dragend(callback);
      return this;
    }
  }
}
}
