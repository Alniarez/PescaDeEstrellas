var parado = 1
var bajando = 2

var Anzuelo = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    aBajar:null,
    estado: parado,
    ctor:function (space, posicion, layer) {
        // El espacio y la capa del GameLayer
        this.space = space
        this.layer = layer

        // Crear animación
        var framesAnimacion = []
        for (var i = 1; i <= 1; i++) {
            var str = "anzuelo.png"
            var frame = cc.spriteFrameCache.getSpriteFrame(str)
            framesAnimacion.push(frame)
        }

        var animacion = new cc.Animation(framesAnimacion, 1)
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion))

        this.aRemar = actionAnimacionBucle;
        this.aRemar.retain();

        // Crear Sprite
        this.sprite = new cc.PhysicsSprite("#anzuelo.png");

        // Calcular masa y momento
        var width = this.sprite.getContentSize().width
        var height = this.sprite.getContentSize().height

        var mass = 0.3*FLUID_DENSITY*width*height
        var moment = cp.momentForBox(mass, width, height)

        // Cuerpo // Añadir cuerpo al espacio
        this.body = this.space.addBody( new cp.Body(mass, moment))

        this.body.setPos(posicion)

        this.body.setAngle(0)

        this.sprite.setBody(this.body)

        // Forma
        this.shape = new cp.BoxShape(this.body, width, height)

        // Tipo de colisión
        this.shape.setCollisionType(tipoAnzuelo)
        //this.shape.setSensor(true)

        // Añadir forma al espacio
        this.space.addShape(this.shape)

        // Ejecutar la animación
        this.sprite.runAction(this.aRemar)

        layer.addChild(this.sprite,10)
    }
,
    eliminar:function(){
        this.space.removeShape(this.shape)
        //this.space.removeBody(shape.getBody())
        this.layer.removeChild(this.sprite)
    }
,
    getShape:function(){
        return this.shape
    }
,
    actualizar:function(gameLayer){
        //Ya no está el anzuelo siempe colgando ahora aparece solo al pescar
        //this.body.p.x = gameLayer.jugador.body.p.x+120
        //if(this.estado == parado){
          //  this.body.p.y = gameLayer.jugador.body.p.y
        //}
    }
})