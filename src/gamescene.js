//Tipos
var tipoAgua = 1
var tipoBote = 2
var tipoSuelo = 3
var tipoLimiteAgua = 4
var tipoPez = 5
var tipoAnzuelo = 6

//Agua
var FLUID_DENSITY = 0.00014
var FLUID_DRAG = 2.0
var alturaAgua = 0

//Capas
var idCapaJuego = 1
var idCapaControles = 2

var tiempo
var tiempoTranscurri

//
var GameLayer = cc.Layer.extend({
    space:null,
	jugador:null,
	mapa: null,
 	mapaAncho: null,
 	peces:[],
 	formasEliminar:[],
 	anzuelo:null,
 	eliminarAnzuelo:false,
    ctor:function () {
        this._super()
        var size = cc.winSize

        // Caché de imagenes
        cc.spriteFrameCache.addSpriteFrames(res.barco_plist)
		cc.spriteFrameCache.addSpriteFrames(res.anzuelo_plist)
		cc.spriteFrameCache.addSpriteFrames(res.amarillo_plist)
		cc.spriteFrameCache.addSpriteFrames(res.añil_plist)
		cc.spriteFrameCache.addSpriteFrames(res.cian_plist)
		cc.spriteFrameCache.addSpriteFrames(res.morado_plist)
		cc.spriteFrameCache.addSpriteFrames(res.rojo_plist)
		cc.spriteFrameCache.addSpriteFrames(res.rosa_plist)
		cc.spriteFrameCache.addSpriteFrames(res.verde_plist)

        // Inicializar Space
        this.space = new cp.Space()
        this.space.iterations = 30;
       	this.space.gravity = cp.v(0,-500);
       //cpSpaceSetDamping(space, 0.5);
       	this.space.sleepTimeThreshold = 0.5;
       	this.space.collisionSlop = 0.5;

        // Depuración
        //this.depuracion = new cc.PhysicsDebugNode(this.space)
        //this.addChild(this.depuracion, 10)

    	this.jugador = new Jugador(this.space, cc.p(250,250), this)
    	// El anzuelo ya no está siempre.
    	//this.anzuelo = new Anzuelo(this.space,cc.p(this.jugador.body.p.x+160, this.jugador.body.p.y),this)

    	// Crear las colisiones
    	this.space.addCollisionHandler( tipoAgua, tipoBote, null, this.flota.bind(this), null, null);
		this.space.addCollisionHandler( tipoSuelo, tipoBote, null, null, this.collisionSueloConJugador.bind(this), null)
		this.space.addCollisionHandler( tipoAnzuelo, tipoPez , null, null, this.collisionPezAnzuelo.bind(this),null)
		this.space.addCollisionHandler( tipoAnzuelo, tipoSuelo , null, null, this.collisionSueloAnzuelo.bind(this),null)

		// Cargar el mapa
		this.cargarMapa()

        this.scheduleUpdate()

        tiempo = new Date().getTime()

        return true
    }
,
	update:function (dt) {
    	this.space.step(dt)

    	// Evitar inclinación excesiva
     	if( this.jugador.body.a > 0.25)
			this.jugador.body.setAngle(0.25)
        if( this.jugador.body.a < -0.25)
        	this.jugador.body.setAngle(-0.25)

		// Mover la cámara
    	var posicionXJugador = this.jugador.body.p.x-400
   		this.setPosition(cc.p( -posicionXJugador,0))

		// Ya no está el anzuelo siempre.
		/*
		if(this.anzuelo != null)
    		this.anzuelo.actualizar(this)
    	*/
    	// Mover los peces
   		for (var i = 0; i < this.peces.length; i++) {
   			this.peces[i].mover()
   		}

		// Si hay formas a eliminar
    	for(var i = 0; i < this.formasEliminar.length; i++) {
   			var shape = this.formasEliminar[i];
			// Si alguna es un pez
        	for (var i = 0; i < this.peces.length; i++) {
    	    	if (this.peces[i].getShape() == shape) {
            		this.peces[i].eliminar();
                	this.peces.splice(i, 1);
            	}
        	}
    	}
    	this.formasEliminar = []

		// Si hay que eliminar el anuzelo
    	if(this.eliminarAnzuelo == true){
    		this.anzuelo.eliminar()
    		this.anzuelo = null
    		this.eliminarAnzuelo = false
    	}

    	// Comprobar fin
    	 var tiempoActual = new Date().getTime()
    	 if(tiempoActual - tiempo > 60000)
    	 	cc.director.runScene(new MenuLayer())
	}
,
	cargarMapa:function(){
		this.mapa = new cc.TMXTiledMap(res.mapa)

		// Añadir mapa a la Layer
		this.addChild(this.mapa)

    	// Ancho del mapa
    	this.mapaAncho = this.mapa.getContentSize().width

    	// Solicitar los objeto dentro de la capa Suelos
    	var grupoSuelos = this.mapa.getObjectGroup("Suelos")
    	var suelosArray = grupoSuelos.getObjects()

    	// Los objetos de la capa suelos se transforman a formas estáticas de Chipmunk ( SegmentShape ).
    	// Suelos
		for (var i = 0; i < suelosArray.length; i++) {
			var suelo = suelosArray[i]
        		var puntos = suelo.polylinePoints
            	for(var j = 0; j < puntos.length - 1; j++){
            		var bodySuelo = new cp.StaticBody()
            		var shapeSuelo = new cp.SegmentShape(bodySuelo,
            			cp.v(parseInt(suelo.x) + parseInt(puntos[j].x),
            			parseInt(suelo.y) - parseInt(puntos[j].y)),
            			cp.v(parseInt(suelo.x) + parseInt(puntos[j + 1].x),
            			parseInt(suelo.y) - parseInt(puntos[j + 1].y)), 10)
            		shapeSuelo.setCollisionType(tipoSuelo)
        			this.space.addStaticShape(shapeSuelo)
      			}
    	}

		// Peces
    	var grupPeces = this.mapa.getObjectGroup("Peces")
    	var pecesArray = grupPeces.getObjects()
    	for (var i = 0; i < pecesArray.length; i++) {
    		var pese = new Pez(this.space,
    			cc.p(pecesArray[i]["x"],pecesArray[i]["y"]), this)
        	this.peces.push(pese)
    	}

		// Agua
    	var staticBody = this.space.staticBody;
    	//Si no hay agua en el se crea esta de modo provisional
    	var bb = new cp.BB(00, 00, 80000, 240)

   		var grupoAgua = this.mapa.getObjectGroup("Agua")
    	var aguaArray = grupoAgua.getObjects()
    	for (var i = 0; i < aguaArray.length; i++) {
    		bb = new cp.BB(aguaArray[i]["x"], aguaArray[i]["y"],
    			aguaArray[i]["width"], aguaArray[i]["height"])
    		alturaAgua = aguaArray[i]["height"]
    		console.log("Algutra del agua = "+alturaAgua)
    	}

     	shape = this.space.addShape( new cp.BoxShape2(staticBody, bb) )
     	shape.setSensor(true)
     	shape.setCollisionType(tipoAgua)
	}
,
	collisionSueloConJugador:function (arbiter, space) {
        this.jugador.choca()
    }
,
	collisionSueloAnzuelo:function(arbiter,space){
		this.eliminarAnzuelo=true
	}
,
	collisionPezAnzuelo:function(arbiter, space){
		var shapes = arbiter.getShapes()
		this.formasEliminar.push(shapes[1])
		var capaControles = this.getParent().getChildByTag(idCapaControles)
		capaControles.capturaPez()
		this.eliminarAnzuelo=true
	}
,
	// Funcion de flote tal y como se encuentra en los ejemplos de utilización en la documentación
	flota:function (arb, space) {
    	var shapes = arb.getShapes()
		var water = shapes[0]
		var poly = shapes[1]

		var body = poly.getBody()

		// Get the top of the water sensor bounding box to use as the water level.
		var level = water.getBB().t

		// Clip the polygon against the water level
		var count = poly.getNumVerts();

		var clipped = []

		var j=count-1
		for(var i=0; i<count; i++) {
			var a = body.local2World( poly.getVert(j))
			var b = body.local2World( poly.getVert(i))

			if(a.y < level){
				clipped.push(a.x)
				clipped.push(a.y)
			}

			var a_level = a.y - level
			var b_level = b.y - level

			if(a_level*b_level < 0.0){
				var t = Math.abs(a_level)/(Math.abs(a_level) + Math.abs(b_level))

				var v = cp.v.lerp(a, b, t)
				clipped.push(v.x)
				clipped.push(v.y)
			}
			j=i;
		}

		// Calculate buoyancy from the clipped polygon area
		var clippedArea = cp.areaForPoly(clipped)

		var displacedMass = clippedArea*FLUID_DENSITY
		var centroid = cp.centroidForPoly(clipped)
		var r = cp.v.sub(centroid, body.getPos())

		var dt = space.getCurrentTimeStep()
		var g = space.gravity

		// Apply the buoyancy force as an impulse.
		body.applyImpulse( cp.v.mult(g, -displacedMass*dt), r)

		// Apply linear damping for the fluid drag.
		var v_centroid = cp.v.add(body.getVel(), cp.v.mult(cp.v.perp(r), body.w))
		var k = 1; //k_scalar_body(body, r, cp.v.normalize_safe(v_centroid))
		var damping = clippedArea*FLUID_DRAG*FLUID_DENSITY
		var v_coef = Math.exp(-damping*dt*k) // linear drag
		//var v_coef = 1.0/(1.0 + damping*dt*cp.v.len(v_centroid)*k) // quadratic drag
		body.applyImpulse( cp.v.mult(cp.v.sub(cp.v.mult(v_centroid, v_coef), v_centroid), 1.0/k), r)

		// Apply angular damping for the fluid drag.
		var w_damping = cp.momentForPoly(FLUID_DRAG*FLUID_DENSITY*clippedArea, clipped, cp.v.neg(body.p))
		body.w *= Math.exp(-w_damping*dt* (1/body.i))

		return true
    }
})

// GameScene compuesto por GameLayer y ControlesLayer
var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super()
        // GameLayer
        var layer = new GameLayer()
        this.addChild(layer, 0, idCapaJuego)

		//ControlesLayer
        var controlesLayer = new ControlesLayer()
        this.addChild(controlesLayer, 0, idCapaControles)
    }
})