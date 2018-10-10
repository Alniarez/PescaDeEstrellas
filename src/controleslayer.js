var ControlesLayer = cc.Layer.extend({
    spriteBotonIzquierda:null,
    spriteBotonDerecha:null,
    spriteBotonPescar:null,
    etiquetaPuntos:null,
    puntos:0,

    ctor:function () {
        this._super()
        var size = cc.winSize

        // Contador puntos
        this.etiquetaMonedas = new cc.LabelTTF(" ", "Helvetica", 20);
        this.etiquetaMonedas.setPosition(cc.p(size.width - 90, size.height - 45));
        this.etiquetaMonedas.fillStyle = new cc.Color(0, 0, 0, 0);
        this.addChild(this.etiquetaMonedas);

        // Botones
        this.spriteBotonIzquierda = cc.Sprite.create(res.Boton_I)
        this.spriteBotonIzquierda.setPosition(cc.p((size.width*0.8), size.height*0.2))
        this.spriteBotonIzquierda.setScale(0.25)
        this.addChild(this.spriteBotonIzquierda)

        this.spriteBotonDerecha = cc.Sprite.create(res.Boton_D)
        this.spriteBotonDerecha.setPosition(cc.p((size.width*0.9), size.height*0.2))
        this.spriteBotonDerecha.setScale(0.25)
        this.addChild(this.spriteBotonDerecha)

        this.spriteBotonPescar = cc.Sprite.create(res.Boton_P)
        this.spriteBotonPescar.setPosition(cc.p((size.width*0.1), size.height*0.2))
        this.spriteBotonPescar.setScale(0.25)
        this.addChild(this.spriteBotonPescar)

        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown
            }, this)

        this.scheduleUpdate()
        return true
    }
,
    update:function (dt) {
        this.etiquetaMonedas.setString("Puntos: " + this.puntos)
        textoFinJuego = "¡Has conseguido "+ this.puntos +" puntos!"
    }
,
    capturaPez:function() {
        this.puntos++
        console.log(this.puntos)
    }
,
    procesarMouseDown:function(event) {
        var instancia = event.getCurrentTarget()
        var areaIzquierda = instancia.spriteBotonIzquierda.getBoundingBox()
        var areaDerecha = instancia.spriteBotonDerecha.getBoundingBox()
        var areaPesca = instancia.spriteBotonPescar.getBoundingBox()

        if (cc.rectContainsPoint(areaIzquierda, cc.p(event.getLocationX(), event.getLocationY()) )){
            // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
            var gameLayer = instancia.getParent().getChildByTag(idCapaJuego)
            gameLayer.jugador.mover(izquierda)

        }
        if (cc.rectContainsPoint(areaDerecha, cc.p(event.getLocationX(), event.getLocationY()) )){
            var gameLayer = instancia.getParent().getChildByTag(idCapaJuego)
            gameLayer.jugador.mover(derecha)
        }
        if (cc.rectContainsPoint(areaPesca, cc.p(event.getLocationX(), event.getLocationY()) )){
            var gameLayer = instancia.getParent().getChildByTag(idCapaJuego)
            gameLayer.jugador.pescar(gameLayer)
        }
    }
})
