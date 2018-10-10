var Pez = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    aNadar:null,
    ctor:function (space, posicion, layer) {
        // El espacio y la capa del GameLayer
        this.space = space
        this.layer = layer

        // Crear animación
        var framesAnimacion = []

        var num = Math.floor(Math.random() * 7)
        var skin = null
        switch (num) {
            case 0:
                skin = "amarillo";
                break;
            case 1:
                skin = "añil";
                break;
            case 2:
                skin = "cian";
                break;
            case 3:
                skin = "morado";
                break;
            case 4:
                skin = "rojo";
                break;
            case 5:
                skin = "rosa";
                break;
            case 6:
                skin = "verde";
                break;
        }


        for (var i = 1; i <= 2; i++) {
            var str = skin + i +".png"
            var frame = cc.spriteFrameCache.getSpriteFrame(str)
            framesAnimacion.push(frame)
        }

        var animacion = new cc.Animation(framesAnimacion, 1)
        var actionAnimacionBucle =
           new cc.RepeatForever(new cc.Animate(animacion))

        this.aNadar = actionAnimacionBucle
        this.aNadar.retain()

        // Crear Sprite
        this.sprite = new cc.PhysicsSprite("#"+skin+"1.png")

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

        // Tipo de colision
        this.shape.setCollisionType(tipoPez)

        // Añadir forma al espacio
        this.space.addShape(this.shape)
        // añadir sprite a la capa

        // ejecutar la animación
        this.sprite.runAction(this.aNadar)

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
    mover:function(){

        // No se salgan
        if(this.body.p.y > alturaAgua)
            this.body.setVel(cp.v(this.body.getVel().x, Math.abs(this.body.getVel().y)*-1))

        // Girarlos
        if(this.body.getVel().x > 0){
                 this.sprite.flippedX = true
             } else {
                  this.sprite.flippedX = false
             }

        // Solo se aplican movimientos un 4% de las iteraciones
        if( (Math.floor((Math.random() * 100))) > 4 )
            return

        var impulsoX = 0
        var impulsoY = 0
        var b = this.body
        var vel = b.getVel()



                // Temporalmente siempre se mueven sin control
        //        impulsoX = (Math.floor((Math.random() * 20)) - 10) / 10
        //        impulsoY = (Math.floor((Math.random() * 20)) - 5) / 50

       // Impulso x
               if(vel.x < 80 || vel.x > -80)
                   impulsoX = (Math.floor((Math.random() * 30)) - 15) / 5

               // Impulso Y
               if(vel.y < 50 || vel.y > -50){
                   if(b.p.y > alturaAgua-(alturaAgua*20)/100)
                       impulsoY = (Math.floor(Math.random() * 40) - 15) / 4
                   else if( b.p.y < 50)
                       impulsoY = (Math.floor(Math.random() * 25)) / 4
                   else
                       impulsoY = (Math.floor(Math.random() * 30) - 15) / 4
               }


        // Se mueven
        this.body.applyImpulse( cp.v(impulsoX, impulsoY ), cp.v( 0, 0))


    }
})