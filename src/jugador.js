var Jugador = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    aRemar:null,
    ctor:function (space, posicion, layer) {
        // El espacio y la capa del GameLayer
        this.space = space
        this.layer = layer

        // Crear animación
        var framesAnimacion = []
        for (var i = 1; i <= 2; i++) {
            var str = "barco" + i + ".png"
            var frame = cc.spriteFrameCache.getSpriteFrame(str)
            framesAnimacion.push(frame)
        }

        var animacion = new cc.Animation(framesAnimacion, 1)
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion))

        this.aRemar = actionAnimacionBucle
        this.aRemar.retain()

        // Crear Sprite
        this.sprite = new cc.PhysicsSprite("#barco1.png")

        // Calcular masa y momento
        var width = this.sprite.getContentSize().width
        var height = this.sprite.getContentSize().height

        var mass = 0.3*FLUID_DENSITY*width*height
        var moment = cp.momentForBox(mass, width, height)

        // Cuerpo // Añadir cuerpo al espacio
        this.body = this.space.addBody( new cp.Body(mass*1.6, moment))

        this.body.setPos(posicion)

        this.body.setAngle(0)

        this.sprite.setBody(this.body)

        // Forma
        this.shape = new cp.BoxShape(this.body, width, height)

        // Tipo de colisión
        this.shape.setCollisionType(tipoBote)

        // Añadir forma al espacio
        this.space.addShape(this.shape)

        // Ejecutar la animación
        this.sprite.runAction(this.aRemar)

        layer.addChild(this.sprite,10)

    }
,
    choca  : function(){
        var bodyJugador = this.body
        bodyJugador.setVel(cp.v(bodyJugador.getVel().x*-1, bodyJugador.getVel().y))
    }
,
    mover : function(lado){
        if(lado == izquierda)
            this.body.applyImpulse(cp.v(-140, 0), cp.v(0, 0))
        if(lado == derecha)
            this.body.applyImpulse(cp.v(140, 0), cp.v(0, 0))
    }
,
    pescar : function(gameLayer){
        if(gameLayer.anzuelo == null)
            gameLayer.anzuelo = new Anzuelo(
                gameLayer.space,cc.p(this.body.p.x+120,this.body.p.y),gameLayer)

    }
})