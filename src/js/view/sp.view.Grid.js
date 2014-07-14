/**
 * Solar Playground view grid.
 * Display a grid on the canvas
 *
 * @class
 * @param {sp.container.Screen} screen Screen handler
 * @param {sp.view.Converter} view View handler
 * @param {Object} [config] Configuration object
 */
sp.view.Grid = function SpViewGrid( screen, view, config ) {
	this.screen = screen;
	this.viewConverter = view;

	// Configuration
	this.config = config || {};

	this.color = this.config.grid_color || '#575757';
	this.spacing = this.config.spacing || { x: 45, y: 45 };
};

/**
 * Draw the grid on the canvas, based on the scenario centerpoint
 * and the pitch.
 */
sp.view.Grid.prototype.draw = function SpViewDraw() {
	var dx, margin, topPt, botPt,
		toRadians = Math.PI / 180,
		counter = 0,
		dimensions = this.screen.getDimensions(),
		context = this.screen.getContext(),
		center = this.viewConverter.getCenterPoint(),
		pitch = this.viewConverter.getPitchAngle();
	// TODO: Add support for yaw

	// TODO: Draw an elliptical grid based on the orbits

	// Calculate margin
	if ( pitch > Math.PI / 4 ) {
		margin = ( dimensions.height / 2 ) * Math.tan( pitch );
	} else if ( pitch > 0 && pitch < Math.PI / 4 ) {
		margin = ( dimensions.height / 2 ) * Math.tan( Math.PI / 4 - pitch );
	} else {
		margin = 0;
	}
	H = dimensions.height / 2 - margin;
	d = H * Math.tan( pitch );

	topEdge = center.y - H;
	bottomEdge = center.y + H;

	// Draw top and bottom margins
	this.screen.drawLine(
		[ 0, topEdge ],
		[ dimensions.width, topEdge ],
		this.color, 1, false
	);
	this.screen.drawLine(
		[ 0, bottomEdge ],
		[ dimensions.width, bottomEdge ],
		this.color, 1, false
	);

	// Draw x origin
	this.screen.drawLine(
		[ 0, center.y ],
		[ dimensions.width, center.y ],
		this.color, 1, false
	);

	// Draw x grid up and down (from center)
	counter = 0;
	gridPoint = center.y;
	while ( gridPoint - this.spacing.x > topEdge ) {
		gridPoint = center.y - this.spacing.x * counter;
		this.screen.drawLine(
			[ 0, gridPoint ],
			[ dimensions.width, gridPoint ],
			this.color, 1, false
		);
		counter++;
	}

	counter = 0;
	gridPoint = center.y;
	while ( gridPoint + this.spacing.x < bottomEdge ) {
		gridPoint = center.y + this.spacing.x * counter;
		this.screen.drawLine(
			[ 0, gridPoint ],
			[ dimensions.width, gridPoint ],
			this.color, 1, false
		);
		counter++;
	}

	// Draw y origin (tilted as necessary)
	originGridPointTop = center.x + d;
	originGridPointBottom = center.x - d;
	this.screen.drawLine(
		[ center.x + d, topEdge ],
		[ center.x - d, bottomEdge ],
		this.color, 1, false
	);

	// Draw y grid left and right (from center)
	gridPointTop = originGridPointTop;
	gridPointBottom = originGridPointBottom;
	while (
		gridPointTop > 0 && gridPointTop < dimensions.width ||
		gridPointBottom > 0 && gridPointBottom < dimensions.width
	) {
		gridPointTop += this.spacing.y;
		gridPointBottom += this.spacing.y;
		this.screen.drawLine(
			[ gridPointTop, topEdge ],
			[ gridPointBottom, bottomEdge ],
			this.color, 1, false
		);
	}

	gridPointTop = originGridPointTop;
	gridPointBottom = originGridPointBottom;
	while (
		gridPointTop > 0 && gridPointTop < dimensions.width ||
		gridPointBottom > 0 && gridPointBottom < dimensions.width
	) {
		gridPointTop -= this.spacing.y;
		gridPointBottom -= this.spacing.y;
		this.screen.drawLine(
			[ gridPointTop, topEdge ],
			[ gridPointBottom, bottomEdge ],
			this.color, 1, false
		);
	}
};

/**
 * Get the current center point of the view
 * @returns {Object} x/y coordinates of the current center point
 */
sp.view.Grid.prototype.getCenterPoint = function () {
	return this.viewConverter.getCenterPoint();
};
