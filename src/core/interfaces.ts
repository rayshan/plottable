module Plottable {
  // TODO: I'm pretty sure this is a mistake, and we always just mean
  // any[]|DataSource. I mean, we just straight-up cast this thing into a
  // DataSource, but then we expect data to be a function
  export interface DatasetInterface {
    data: any[];
    metadata: Metadata;
  }

  // TODO: only used by DatasetInterface, remove when DatasetInterface removed
  export interface Metadata {
    cssClass?: string;
    color?: string;
  }

  export interface _Accessor {
    (datum: any, index?: number, metadata?: any): any;
  };

  /**
   * A function to map across the data in a DataSource. For example, if your
   * data looked like `{foo: 5, bar: 6}`, then a popular function might be
   * `function(d) { return d.foo; }`.
   *
   * Index, if used, will be the index of the datum in the array.
   */
  export interface AppliedAccessor {
    (datum?: any, index?: number) : any;
  }

  export interface _Projector {
    accessor: _Accessor;
    scale?: Scale.AbstractScale<any, any>;
    attribute: string;
  }

  /**
   * A mapping from attributes ("x", "fill", etc.) to the functions that get
   * that information out of the data.
   *
   * So if my data looks like `{foo: 5, bar: 6}` and I want the radius to scale
   * with both `foo` and `bar`, an entry in this type might be `{"r":
   * function(d) { return foo + bar; }`.
   */
  export interface AttributeToProjector {
    [attrToSet: string]: AppliedAccessor;
  }

  /**
   * A simple bounding box.
   */
  export interface SelectionArea {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  }

  export interface _SpaceRequest {
    width: number;
    height: number;
    wantsWidth: boolean;
    wantsHeight: boolean;
  }

  export interface _PixelArea {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  }

  /**
   * The range of your current data. For example, [1, 2, 6, -5] has the Extent
   * `{min: -5, max: 6}`.
   *
   * The point of this type is to hopefully replace the less-elegant `[min,
   * max]` extents produced by d3.
   */
  export interface Extent {
    min: number;
    max: number;
  }

  /**
   * A simple location on the screen.
   */
  export interface Point {
    x: number;
    y: number;
  }

  /**
   * A key that is also coupled with a dataset and a drawer.
   */
  export interface DatasetDrawerKey {
    dataset: Dataset;
    drawer: _Drawer.AbstractDrawer;
    key: string;
  }
}
