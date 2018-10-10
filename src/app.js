var izquierda = -50
var derecha = 50

var textoFinJuego = ""

var MenuLayer = cc.Layer.extend({
    ctor:function () {
        this._super()
        var size = cc.winSize

        // Fondo
        var spriteFondoTitulo= new cc.Sprite(res.Menu_Fondo_png)

        // Asigno posición central
        spriteFondoTitulo.setPosition(cc.p(size.width / 2, size.height / 2))

        // Lo escalo porque es más pequeño que la pantalla
        spriteFondoTitulo.setScale(size.height / spriteFondoTitulo.height)

        // Añado Sprite a la escena
        this.addChild(spriteFondoTitulo)

        //MenuItemSprite para cada botón
        var menuBotonJugar = new cc.MenuItemSprite(
            new cc.Sprite(res.Menu_Jugar_png), // IMG estado normal
            new cc.Sprite(res.Menu_Jugar_png), // IMG estado pulsado
            this.pulsarBotonJugar, this)

        // creo el menú pasándole los botones
        var menu = new cc.Menu(menuBotonJugar)

        // Asigno posición central
        menu.setPosition(cc.p(size.width / 2, size.height * 0.25))

        // Añado el menú a la escena
        this.addChild(menu)


        var etiqueta = new cc.LabelTTF(textoFinJuego, "Helvetica", 20);
                etiqueta.setPosition(cc.p(size.width / 2, size.height * 0.75));
                etiqueta.fillStyle = new cc.Color(0, 0, 0, 0);
                this.addChild(etiqueta);

        return true
    }
,
    pulsarBotonJugar : function(){
        cc.director.runScene(new GameScene())
        //alert("Jugar")
    }

})

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super()
        var layer = new MenuLayer()
        this.addChild(layer)
    }

})