/**
 * Solar Playground view grid.
 * Display a grid on the canvas
 *
 * @class
 * @param {sp.container.Screen} screen Screen handler
 * @param {Object} [config] Configuration object
 */
sp.view.Grid = function SpViewGrid( screen, config ) {
	// Configuration
	this.config = config || {};

	this.screen = screen;

	this.color = config.grid_color || '#575757';

	this.zoom = this.config.zoom || 1;
	this.pitch = this.config.pitch || 0;
	this.yaw = this.config.yaw;
	this.spacing = this.config.spacing || { x: 45, y: 45 };

	this.canvasDimensions = this.config.canvasDimensions || { 'width': 0, 'height': 0 };
	this.scenarioCenterPoint = {
		'x': this.canvasDimensions.width / 2,
		'y': this.canvasDimensions.height / 2
	};
};

/**
 * Draw the grid on the canvas, based on the scenario centerpoint
 * and the pitch and yaw.
 */
sp.view.Grid.prototype.draw = function SpViewDraw() {
	var dx,
		counter = 0,
		xtop = 0,
		xbottom = 0,
		ypitch = 0,
		dimensions = this.screen.getDimensions(),
		context = this.screen.getContext(),
		center = this.getCenterPoint();

	// Calculate the shift
	dx = ( center.y / 2 ) * Math.tan( this.pitch );
//	dy = this.spacing.y * Math.cos( this.pitch );
//	maxy = dimensions.width - dx;
	// Draw grid
	while (
		xtop >= 0 && xtop <= dimensions.width ||
		xbottom >= 0 && xbottom <= dimensions.width
	) {
		xtop = ( center.x - dx ) + counter * this.spacing.x;
		xbottom = ( center.x + dx ) + counter * this.spacing.x;
		this.screen.drawLine(
			{
				'x': xtop,
				'y': 0
			},
			{
				'x': xbottom,
				'y': dimensions.height
			},
			this.color,
			1,
			true
		);

		// Mirror
		xtop = ( center.x - dx ) - counter * this.spacing.x;
		xbottom = ( center.x + dx ) - counter * this.spacing.x;
		this.screen.drawLine(
			{
				'x': xtop,
				'y': 0
			},
			{
				'x': xbottom,
				'y': dimensions.height
			},
			this.color,
			1,
			true
		);
		counter++;
	}
/*
	counter = 0;
	while ( ypitch >= maxy && ypitch <= dimensions.height - maxy ) {
		ypitch = ( center.y + dy ) + counter * this.spacing.y;
		this.screen.drawLine(
			{
				'x': maxy,
				'y': ypitch
			},
			{
				'x': dimensions.height - maxy,
				'y': ypitch
			},
			this.color,
			1,
			true
		);
		// Mirror
		ypitch = ( center.y - dy ) - counter * this.spacing.y;
		this.screen.drawLine(
			{
				'x': 0,
				'y': ypitch
			},
			{
				'x': dimensions.width,
				'y': ypitch
			},
			this.color,
			1,
			true
		);
		counter++;
	}
/*
	// Draw y axis
	context.beginPath();
	context.moveTo( 0, center.y );
	context.lineTo( dimensions.width, center.y );
	context.strokeStyle = this.color;
	if ( context.setLineDash ) {
		context.setLineDash( [ 5, 7 ] );
	}
	context.lineWidth = 1;
	context.stroke();*/
};

/**
 * Set the scenario center point
 * @param {Object} coords x/y coordinates of the center of the system
 */
sp.view.Grid.prototype.setCenterPoint = function ( coords ) {
	coords = coords || {};

	x = coords.x || 0;
	y = coords.y || 0;

	this.scenarioCenterPoint = {
		'x': x,
		'y': y
	};
};

/**
 * Get the current center point of the view
 * @returns {Object} x/y coordinates of the current center point
 */
sp.view.Grid.prototype.getCenterPoint = function () {
	return this.scenarioCenterPoint;
};
