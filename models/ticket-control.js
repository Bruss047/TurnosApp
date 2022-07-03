const path = require('path');
const fs = require('fs');

class Ticket{
    constructor(numero, escritorio){
        this.numero= numero;
        this.escritorio= escritorio;
    }
}

class TicketControl{

    constructor(){
        this.ultimo=0;
        this.hoy= new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        this.init();
    }

    get toJson(){

        return{

            ultimo: this.ultimo,
            hoy:this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
            
        }
    }

    init(){
        const {ultimo, hoy, tickets, ultimos4} = require('../db/data.json');

        if(hoy===this.hoy){
            this.ultimo=ultimo;
            this.tickets=tickets;
            this.ultimos4=ultimos4;
        }else{
            //es otro día
            this.guardarDB();
       }

        
    }

    guardarDB(){
       const dbPath = path.join(__dirname,'../db/data.json');
       fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiente(){
        this.ultimo+=1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.guardarDB();

        return `Ticket ${ticket.numero}`;
    }

    atenderTicket(escritorio){

        if(this.tickets.length===0){
            return null
        }
        const ticket = this.tickets[0];
        this.tickets.shift(); //borra el ticket del arreglo.
        ticket.escritorio=escritorio; //se le asigna un escritorio de atención al ticket.

        this.ultimos4.unshift(ticket); //añade un ticket al principio del arreglo.

        if(this.ultimos4.length>4){
            this.ultimos4.splice(-1,1);
        }
        this.guardarDB();

        return ticket; //retorna el ticket que debe atender el escritorio.
    }
}

module.exports=TicketControl;