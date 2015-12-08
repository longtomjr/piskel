describe("FrameUtils suite", function() {
  var black = '#000000';
  var red = '#ff0000';
  var transparent = Constants.TRANSPARENT_COLOR;

  // shortcuts
  var toFrameGrid = test.testutils.toFrameGrid;
  var frameEqualsGrid = test.testutils.frameEqualsGrid;

  it("merges 2 frames", function () {
    var B = black, R = red, T = transparent;
    var frame1 = pskl.model.Frame.fromPixelGrid([
      [B, T],
      [T, B]
    ]);

    var frame2 = pskl.model.Frame.fromPixelGrid([
      [T, R],
      [R, T]
    ]);

    var mergedFrame = pskl.utils.FrameUtils.merge([frame1, frame2]);
    frameEqualsGrid(mergedFrame, [
      [B, R],
      [R, B]
    ]);
  });

  it("returns same frame when merging single frame", function () {
    var B = black, T = transparent;
    var frame1 = pskl.model.Frame.fromPixelGrid(toFrameGrid([
      [B, T],
      [B, T]
    ]));

    var mergedFrame = pskl.utils.FrameUtils.merge([frame1]);
    frameEqualsGrid(mergedFrame, [
      [B, T],
      [B, T]
    ]);
  });

  var checkPixelsColor = function (frame, pixels, color) {
    pixels.forEach(function (pixel) {
      var pixelColor = frame.getPixel(pixel[0], pixel[1]);
      expect(pixelColor).toBe(color);
    });
  };

  it ("converts an image to a frame", function () {
    var B = black, T = transparent;
    var frame1 = pskl.model.Frame.fromPixelGrid([
      [B, T],
      [T, B]
    ]);

    var canvas = pskl.utils.FrameUtils.toCanvas(frame1, transparent);
    expect(canvas.width).toBe(2);
    expect(canvas.height).toBe(2);

    var biggerCanvas = pskl.utils.ImageResizer.scale(canvas, 3);
    expect(biggerCanvas.width).toBe(6);
    expect(biggerCanvas.height).toBe(6);

    var biggerFrame = pskl.utils.FrameUtils.createFromImage(biggerCanvas);

    frameEqualsGrid(biggerFrame, [
      [B, B, B, T, T, T],
      [B, B, B, T, T, T],
      [B, B, B, T, T, T],
      [T, T, T, B, B, B],
      [T, T, T, B, B, B],
      [T, T, T, B, B, B]
    ]);
  });

  it ("[LayerUtils] creates a layer from a simple spritesheet", function () {
    var B = black, R = red;

    // original image in 4x2
    var frame = pskl.model.Frame.fromPixelGrid(toFrameGrid([
      [B, R, B, R],
      [R, B, B, R]
    ]));

    var spritesheet = pskl.utils.FrameUtils.toCanvas(frame, transparent);

    // split the spritesheet by 4
    var frames = pskl.utils.LayerUtils.createLayerFromSpritesheet(spritesheet, 4);

    // expect 4 frames of 1x2
    expect(frames.length).toBe(4);

    // verify frame content
    frameEqualsGrid(frames[0], [
      [B],
      [R]
    ]);
    frameEqualsGrid(frames[1], [
      [R],
      [B]
    ]);
    frameEqualsGrid(frames[2], [
      [B],
      [B]
    ]);
    frameEqualsGrid(frames[3], [
      [R],
      [R]
    ]);
  });

  it ("supports null values in frame array", function () {
    var B = black, T = transparent;
    var frame = pskl.model.Frame.fromPixelGrid([
      [B, null],
      [null, B]
    ]);

    var image = pskl.utils.FrameUtils.toCanvas(frame, transparent);

    // transform back to frame for ease of testing
    var testFrame = pskl.utils.FrameUtils.createFromImage(image);
    frameEqualsGrid(testFrame, [
      [B, T],
      [T, B]
    ]);
  });
});