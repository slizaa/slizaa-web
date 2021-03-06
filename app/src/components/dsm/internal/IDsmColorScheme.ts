export interface IDsmColorScheme {

     getSideMarkerBackgroundColor(): string;
  
    getSideMarkerEvenColor(): string;
  
    getSideMarkerMarkedColor(): string;
  
    getSideMarkerSeparatorColor(): string;
  
    getSideMarkerTextColor(): string;
  
    getMatrixSeparatorColor(): string;
  
    getMatrixBackgroundColor(): string;
  
    getMatrixTextColor(): string;
  
    getMatrixDiagonalColor(): string;
  
    getMatrixMarkedColumnRowColor(): string;
  
    getMatrixMarkedCellColor(): string;
  
    getCycleSideMarkerColor(): string;
  
    getCycleMatrixMarkedColumnRowColor(): string;
  
    getCycleSideMarkerSeparatorColor(): string;
  
    getCycleMatrixMarkedCellColor(): string;
  
    getCycleMatrixDiagonalColor(): string;
  
    getCycleSideMarkerMarkedColor(): string;
  }

  export class DefaultColorScheme implements IDsmColorScheme {

  // ##### Palette by Scheme Designer
  // ##### Palette URL: http://colorschemedesigner.com/#1611ThWs0g0g0
  // ##### Generated by Scheme Designer (c) Petr Stanicek 2002-2010
  // var. 1 = #FFDE8A = rgb(255,222,138)
  // var. 2 = #DEC585 = rgb(222,197,133)
  // var. 3 = #D1AE54 = rgb(209,174,84)
  // var. 4 = #FFEAB2 = rgb(255,234,178)
  // var. 5 = #FFF3D3 = rgb(255,243,211)

  // ##### Palette by Scheme Designer
  // ##### Palette URL: http://colorschemedesigner.com/#0911ThWs0g0g0
  // ##### Space: RGB;
  // var. 1 = #DF8462 = rgb(223,132,98)
  // var. 2 = #C37D64 = rgb(195,125,100)
  // var. 3 = #B85E3D = rgb(184,94,61)
  // var. 4 = #E79476 = rgb(231,148,118)
  // var. 5 = #E79E83 = rgb(231,158,131)

  private BLACK = "#000000";
  // private VAR_1_MEDIUM = "#FFDE8A"
  private VAR_2_DARK_MEDIUM        = "#DEC585"
  // private VAR_3_DARK               = "#D1AE54"
  private VAR_4_LIGHT_MEDIUM       = "#FFEAB2"
  private VAR_5_LIGHT              = "#FFF3D3"
  private CYCLE_VAR_2_DARK_MEDIUM  = "#C37D64"
  private CYCLE_VAR_3_DARK         = "#B85E3D"
  private CYCLE_VAR_4_LIGHT_MEDIUM = "#E79476"
  private CYCLE_VAR_5_LIGHT        = "#E79E83"


  public getSideMarkerBackgroundColor() {
    return this.VAR_5_LIGHT;
  }

  public getCycleSideMarkerColor() {
    return this.CYCLE_VAR_5_LIGHT;
  }

  public getCycleSideMarkerSeparatorColor() {
    return this.CYCLE_VAR_2_DARK_MEDIUM;
  }

  public getCycleMatrixDiagonalColor() {
    return this.CYCLE_VAR_4_LIGHT_MEDIUM;
  }

  public getCycleMatrixMarkedCellColor() {
    return this.CYCLE_VAR_3_DARK;
  }

  public getCycleMatrixMarkedColumnRowColor() {
    return this.CYCLE_VAR_2_DARK_MEDIUM;
  }

  public getCycleSideMarkerMarkedColor() {
    return this.CYCLE_VAR_2_DARK_MEDIUM;
  }

  public getSideMarkerEvenColor() {
    return this.VAR_5_LIGHT;
  }

  public getSideMarkerMarkedColor() {
    return this.VAR_2_DARK_MEDIUM;
  }

  public getSideMarkerSeparatorColor() {
    return this.VAR_2_DARK_MEDIUM;
  }

  public getSideMarkerTextColor() {
    return this.BLACK;
  }

  public getMatrixSeparatorColor() {
    return this.VAR_2_DARK_MEDIUM;
  }

  public getMatrixBackgroundColor() {
    return this.VAR_5_LIGHT;
  }

  public getMatrixTextColor() {
    return this.BLACK;
  }

  public getMatrixDiagonalColor() {
    return this.VAR_4_LIGHT_MEDIUM;
  }

  public getMatrixMarkedColumnRowColor() {
    return this.VAR_2_DARK_MEDIUM;
  }

  public getMatrixMarkedCellColor() {
    return this.VAR_2_DARK_MEDIUM;
  }
  }