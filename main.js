let escuela = {
    aprendizaje: 50,
    docentes: 50,
    infraestructura: 40,
    familias: 50,
    estres: 20,
    presupuesto: 100
};

function actualizarVista(){

    document.getElementById("aprendizaje").textContent = escuela.aprendizaje;
    document.getElementById("docentes").textContent = escuela.docentes;
    document.getElementById("infraestructura").textContent = escuela.infraestructura;
    document.getElementById("familias").textContent = escuela.familias;
    document.getElementById("estres").textContent = escuela.estres;
    document.getElementById("presupuesto").textContent = escuela.presupuesto;

    verificarFin();
}

function mostrar(msg){
    document.getElementById("mensaje").innerHTML = msg;
}

function gastar(costo){
    if(escuela.presupuesto < costo){
        mostrar("❌ No tienes suficiente presupuesto");
        return false;
    }

    escuela.presupuesto -= costo;
    return true;
}

function capacitar(){

    if(!gastar(20)) return;

    escuela.aprendizaje += 10;
    escuela.docentes += 15;

    mostrar("📚 Se realizó capacitación docente.");
    actualizarVista();
}

function tecnologia(){

    if(!gastar(30)) return;

    escuela.infraestructura += 20;
    escuela.aprendizaje += 5;

    mostrar("💻 Se adquirió equipo tecnológico.");
    actualizarVista();
}

function socioemocional(){

    if(!gastar(15)) return;

    escuela.familias += 10;
    escuela.estres -= 10;

    mostrar("❤️ Se fortaleció el apoyo socioemocional.");
    actualizarVista();
}

function tramites(){

    if(!gastar(10)) return;

    escuela.infraestructura += 5;
    escuela.estres += 5;

    mostrar("📄 Se atendieron trámites administrativos.");
    actualizarVista();
}

function comunidad(){

    if(!gastar(25)) return;

    escuela.docentes += 20;
    escuela.aprendizaje += 15;

    mostrar("🤝 Se creó una comunidad de aprendizaje docente.");
    actualizarVista();
}

function verificarFin(){

    if(escuela.aprendizaje >= 100){
        mostrar("🏆 ¡Transformaste exitosamente la escuela!");
    }

    if(escuela.estres >= 100){
        mostrar("😵 Has sufrido desgaste profesional. Fin del juego.");
    }
}

actualizarVista();