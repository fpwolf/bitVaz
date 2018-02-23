/** - Initializing the Kinetic stage - **/
const stage = new Kinetic.Stage({
    container : 'canvas-container',
    width     : 850,
    height    : 500
});

const layerUnder = new Kinetic.Layer({});
const layerOver = new Kinetic.Layer({});

const elements = [];

const img = new Image();
img.src = "img/iphone7case.png";

img.onload = function() {
    const IMG = new Kinetic.Image({
        x      : 0,
        y      : 0,
        width  : 850,
        height : 500,
        image  : img
    });

    layerOver.setListening(false);
    layerOver.add(IMG);
    layerOver.draw();
};

stage.add(layerUnder);
stage.add(layerOver);

function update(activeAnchor, imageToEdit) {
    const group = activeAnchor.getParent();

    const topLeft = group.find('.topLeft')[0];
    const topRight = group.find('.topRight')[0];
    const bottomRight = group.find('.bottomRight')[0];
    const bottomLeft = group.find('.bottomLeft')[0];
    const topMid = group.find('.topMid')[0];
    const bottomMid = group.find('.bottomMid')[0];
    const leftMid = group.find('.leftMid')[0];
    const rightMid = group.find('.rightMid')[0];

    const rotateTopRight = group.find('.rotateTopRight')[0];

    const anchorX = activeAnchor.x();
    const anchorY = activeAnchor.y();

    const width = topRight.x() - topLeft.x();
    const height = bottomLeft.y() - topLeft.y();

    function normalizeMiddleAnchors() {

        const staticX = imageToEdit.getX();
        const staticY = imageToEdit.getY();

        topMid && topMid.y(staticY);
        topMid && topMid.x(staticX + width / 2);

        leftMid && leftMid.y(staticY + height / 2);
        leftMid && leftMid.x(staticX);

        bottomMid && bottomMid.y(staticY + height);
        bottomMid && bottomMid.x(staticX + width / 2);

        rightMid && rightMid.y(staticY + height / 2);
        rightMid && rightMid.x(staticX + width);
    }

    /** - Update anchor positions - **/
    switch(activeAnchor.name()) {
        case 'topLeft':
            topRight.y(anchorY);
            bottomLeft.x(anchorX);
            break;
        case 'topRight':
            topLeft.y(anchorY);
            bottomRight.x(anchorX);
            break;
        case 'bottomRight':
            bottomLeft.y(anchorY);
            topRight.x(anchorX);
            break;
        case 'bottomLeft':
            bottomRight.y(anchorY);
            topLeft.x(anchorX);
            break;
        case 'topMid':
            topLeft.y(anchorY);
            topRight.y(anchorY);
            break;
        case 'bottomMid':
            bottomLeft.y(anchorY);
            bottomRight.y(anchorY);
            break;
        case 'leftMid':
            topLeft.x(anchorX);
            bottomLeft.x(anchorX);
            break;
        case 'rightMid':
            topRight.x(anchorX);
            bottomRight.x(anchorX);
            break;
    }

    normalizeMiddleAnchors();

    imageToEdit.setPosition(topLeft.getPosition());
    if(width && height) {
        imageToEdit.setSize({
            width  : width,
            height : height
        });
    }
}

function addAnchor(group, x, y, name, image) {
    const stage = group.getStage();
    const layer = group.getLayer();

    const anchor = new Kinetic.Circle({
        x           : x,
        y           : y,
        stroke      : '#0029ff',
        fill        : '#ffffff',
        strokeWidth : 2,
        radius      : 8,
        name        : name,
        draggable   : true,
        dragOnTop   : true
    });

    anchor.on('dragmove', function() {
        update(this, image);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
        group.setDraggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function() {
        group.setDraggable(true);
        layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function() {
        const layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        layer.draw();
    });
    anchor.on('mouseout', function() {
        const layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.strokeWidth(2);
        layer.draw();
    });

    group.add(anchor);
    return anchor;
}

document.querySelector('#getImage').addEventListener('click', function() {
    const url = imageUrl.value; //http://wallpaper-gallery.net/images/picture/picture-14.jpg

    const loadedImg = new Image();
    loadedImg.src = url;

    loadedImg.onload = function() {
        const addedImage = new Kinetic.Image({
            x         : 0,
            y         : 0,
            width     : this.width / 2,
            height    : this.height / 2,
            image     : loadedImg,
            draggable : true
        });

        /** - Creating new layer for separate image - **/
        var imgGroup = new Kinetic.Group({
            x         : 270,
            y         : 100,
            draggable : true
        });
        imgGroup.add(addedImage);
        layerUnder.add(imgGroup);
        elements.push(addedImage);

        /** - Adding anchors for the resizing - **/

        addedImage.anchors = [];

        addedImage.anchors.push(addAnchor(imgGroup, 0, addedImage.getY(), 'topLeft', addedImage));
        addedImage.anchors.push(addAnchor(imgGroup, addedImage.getWidth(), addedImage.getY(), 'topRight', addedImage));
        addedImage.anchors.push(addAnchor(imgGroup, addedImage.getWidth(), addedImage.getY() + addedImage.getHeight(), 'bottomRight', addedImage));
        addedImage.anchors.push(addAnchor(imgGroup, 0, addedImage.getY() + addedImage.getHeight(), 'bottomLeft', addedImage));
        addedImage.anchors.push(addAnchor(imgGroup, addedImage.getWidth() / 2, addedImage.getY(), 'topMid', addedImage));
        addedImage.anchors.push(addAnchor(imgGroup, addedImage.getWidth() / 2, addedImage.getY() + addedImage.getHeight(), 'bottomMid', addedImage));
        addedImage.anchors.push(addAnchor(imgGroup, 0, addedImage.getY() + addedImage.getHeight() / 2, 'leftMid', addedImage));
        addedImage.anchors.push(addAnchor(imgGroup, addedImage.getWidth(), addedImage.getY() + addedImage.getHeight() / 2, 'rightMid', addedImage));

        addedImage.on('dragmove', function() {
            addedImage.anchors[0].setX(this.getX());
            addedImage.anchors[0].setY(this.getY());

            addedImage.anchors[1].setX(this.getX() + this.getWidth());
            addedImage.anchors[1].setY(this.getY());

            addedImage.anchors[2].setX(this.getX() + this.getWidth());
            addedImage.anchors[2].setY(this.getY() + this.getHeight());

            addedImage.anchors[3].setX(this.getX());
            addedImage.anchors[3].setY(this.getY() + this.getHeight());

            addedImage.anchors[4].setX(this.getX() + this.getWidth() / 2);
            addedImage.anchors[4].setY(this.getY());

            addedImage.anchors[5].setX(this.getX() + this.getWidth() / 2);
            addedImage.anchors[5].setY(this.getY() + this.getHeight());

            addedImage.anchors[6].setX(this.getX());
            addedImage.anchors[6].setY(this.getY() + this.getHeight() / 2);

            addedImage.anchors[7].setX(this.getX() + this.getWidth());
            addedImage.anchors[7].setY(this.getY() + this.getHeight() / 2);
        });

        imgGroup.on('dragstart', function() {
            this.moveToTop();
        });

        layerUnder.draw();
    }

});

document.querySelector('#getText').addEventListener('click', function() {
    const textV = textArea.value;
    const simpleText = new Kinetic.Text({
        x          : 0,
        y          : 0,
        text       : textV,
        // fontSize: textS,
        width      : textV.clientWidth,
        height     : textV.clientHeight,
        fontFamily : 'Calibri',
        textFill   : 'black',
        stroke     : 'black',
        fill       : 'black',
        draggable  : true
    });

    const textGroup = new Kinetic.Group({
        x         : 270,
        y         : 100,
        draggable : true
    });
    textGroup.add(simpleText);
    layerUnder.add(textGroup);
    elements.push(simpleText);

    document.querySelector('#textSize').addEventListener("change", function() {
        const size = this.value;
        simpleText.fontSize(size);

        layerUnder.draw();
    }, true);

    simpleText.anchors = [];

    simpleText.anchors.push(addAnchor(textGroup, 0, simpleText.getY(), 'topLeft', simpleText));
    simpleText.anchors.push(addAnchor(textGroup, simpleText.getTextWidth(), simpleText.getY(), 'topRight', simpleText));
    simpleText.anchors.push(addAnchor(textGroup, simpleText.getTextWidth(), simpleText.getY() + simpleText.getTextHeight(), 'bottomRight', simpleText));
    simpleText.anchors.push(addAnchor(textGroup, 0, simpleText.getY() + simpleText.getTextHeight(), 'bottomLeft', simpleText));

    simpleText.on('dragmove', function() {
        simpleText.anchors[0].setX(this.getX());
        simpleText.anchors[0].setY(this.getY());

        simpleText.anchors[1].setX(this.getX() + this.getTextWidth());
        simpleText.anchors[1].setY(this.getY());

        simpleText.anchors[2].setX(this.getX() + this.getTextWidth());
        simpleText.anchors[2].setY(this.getY() + this.getTextHeight());

        simpleText.anchors[3].setX(this.getX());
        simpleText.anchors[3].setY(this.getY() + this.getTextHeight());
    });

    textGroup.on('dragstart', function() {
        this.moveToTop();
    });

    layerUnder.draw();
});

const loadFile = function(event) {
    const output = new Image();
    output.src = URL.createObjectURL(event.target.files[0]);

    output.onload = function() {
        const loadedImage = new Kinetic.Image({
            x         : 0,
            y         : 0,
            width     : this.width / 2,
            height    : this.height / 2,
            image     : output,
            draggable : true
        });

        const loadedImageGroup = new Kinetic.Group({
            x         : 270,
            y         : 100,
            draggable : true
        });
        layerUnder.add(loadedImageGroup);
        loadedImageGroup.add(loadedImage);
        elements.push(loadedImage);

        loadedImage.anchors = [];

        /** - Adding anchors for the resizing - **/

        loadedImage.anchors.push(addAnchor(loadedImageGroup, 0, loadedImage.getY(), 'topLeft', loadedImage));
        loadedImage.anchors.push(addAnchor(loadedImageGroup, loadedImage.getWidth(), loadedImage.getY(), 'topRight', loadedImage));
        loadedImage.anchors.push(addAnchor(loadedImageGroup, loadedImage.getWidth(), loadedImage.getY() + loadedImage.getHeight(), 'bottomRight', loadedImage));
        loadedImage.anchors.push(addAnchor(loadedImageGroup, 0, loadedImage.getY() + loadedImage.getHeight(), 'bottomLeft', loadedImage));
        loadedImage.anchors.push(addAnchor(loadedImageGroup, loadedImage.getWidth() / 2, loadedImage.getY(), 'topMid', loadedImage));
        loadedImage.anchors.push(addAnchor(loadedImageGroup, loadedImage.getWidth() / 2, loadedImage.getY() + loadedImage.getHeight(), 'bottomMid', loadedImage));
        loadedImage.anchors.push(addAnchor(loadedImageGroup, 0, loadedImage.getY() + loadedImage.getHeight() / 2, 'leftMid', loadedImage));
        loadedImage.anchors.push(addAnchor(loadedImageGroup, loadedImage.getWidth(), loadedImage.getY() + loadedImage.getHeight() / 2, 'rightMid', loadedImage));

        loadedImage.on('dragmove', function() {
            loadedImage.anchors[0].setX(this.getX());
            loadedImage.anchors[0].setY(this.getY());

            loadedImage.anchors[1].setX(this.getX() + this.getWidth());
            loadedImage.anchors[1].setY(this.getY());

            loadedImage.anchors[2].setX(this.getX() + this.getWidth());
            loadedImage.anchors[2].setY(this.getY() + this.getHeight());

            loadedImage.anchors[3].setX(this.getX());
            loadedImage.anchors[3].setY(this.getY() + this.getHeight());

            loadedImage.anchors[4].setX(this.getX() + this.getWidth() / 2);
            loadedImage.anchors[4].setY(this.getY());

            loadedImage.anchors[5].setX(this.getX() + this.getWidth() / 2);
            loadedImage.anchors[5].setY(this.getY() + this.getHeight());

            loadedImage.anchors[6].setX(this.getX());
            loadedImage.anchors[6].setY(this.getY() + this.getHeight() / 2);

            loadedImage.anchors[7].setX(this.getX() + this.getWidth());
            loadedImage.anchors[7].setY(this.getY() + this.getHeight() / 2);
        });

        loadedImageGroup.on('dragstart', function() {
            this.moveToTop();
        });

        layerUnder.draw();
    }
};

document.querySelector('#saveImage').addEventListener('click', function() {

    elements.forEach(function(e) {
        e.anchors.forEach(function(anchor){
            anchor.hide && anchor.hide();
        });
    });

    stage.draw();
    stage.toDataURL({
        width    : 800,
        height   : 500,
        mimeType : "image/jpeg",
        callback : function(dataUrl) {
            window.open(dataUrl);

            elements.forEach(function(e) {
                e.anchors.forEach(function(anchor){
                    anchor.show && anchor.show();
                });
            });

            stage.draw();
        }
    });
});
